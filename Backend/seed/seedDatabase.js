require("dotenv").config();

const mongoose = require("mongoose");

const catalogue = require("./catalogue");

const {
  findCommonsImage,
  mapWithConcurrency
} = require("./imageService");

const Temple = require("../models/Temple");
const Product = require("../models/Product");
const Category = require("../models/Category");

const DEFAULT_STOCK = Number(
  process.env.SEED_PRODUCT_STOCK || 30
);

const FETCH_IMAGES = process.env.FETCH_IMAGES === "true";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seedDatabase() {
  const mongoUri =
    process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from Backend/.env");
  }

  if (catalogue.length !== 30) {
    throw new Error(
      `Expected 30 temples, found ${catalogue.length}`
    );
  }

  const totalProducts = catalogue.reduce(
    (total, temple) => total + temple.products.length,
    0
  );

  if (totalProducts !== 60) {
    throw new Error(
      `Expected 60 products, found ${totalProducts}`
    );
  }

  await mongoose.connect(mongoUri);

  console.log("MongoDB connected");

  try {
    // ---------------------------------------
    // 1. CREATE CATEGORIES
    // ---------------------------------------

    const categoryNames = [
      ...new Set(
        catalogue.flatMap(temple =>
          temple.products.map(product => product[1])
        )
      )
    ];

    const categoryOps = categoryNames.map(name => ({
      updateOne: {
        filter: { name },

        update: {
          $set: {
            name,
            isActive: true
          },

          $setOnInsert: {
            description: `${name} catalogue category`,
            image: "",
            createdAt: new Date()
          }
        },

        upsert: true
      }
    }));

    await Category.bulkWrite(categoryOps, {
      ordered: false
    });

    const categories = await Category.find({
      name: { $in: categoryNames }
    }).lean();

    const categoryIds = new Map(
      categories.map(category => [
        category.name,
        category._id
      ])
    );

    console.log(`Categories ready: ${categories.length}`);

    // ---------------------------------------
    // 2. OPTIONAL IMAGE RETRIEVAL
    // ---------------------------------------

    const templeImages = new Map();
    const productImages = new Map();

    if (FETCH_IMAGES) {
      console.log(
        "Fetching optional Wikimedia images..."
      );

      const templeImageResults = await mapWithConcurrency(
        catalogue,
        4,
        async temple =>
          findCommonsImage(
            `${temple.name} Tamil Nadu temple`
          )
      );

      catalogue.forEach((temple, index) => {
        templeImages.set(
          temple.slug,
          templeImageResults[index]
        );
      });

      const productJobs = catalogue.flatMap(temple =>
        temple.products.map(product => ({
          temple,
          product
        }))
      );

      const productImageResults = await mapWithConcurrency(
        productJobs,
        4,
        async job =>
          findCommonsImage(
            `${job.product[0]} devotional product India`
          )
      );

      productJobs.forEach((job, index) => {
        const slug =
          `${job.temple.slug}-${slugify(job.product[0])}`;

        productImages.set(
          slug,
          productImageResults[index]
        );
      });
    }

    // ---------------------------------------
    // 3. INSERT / UPDATE TEMPLES
    // ---------------------------------------

    const templeOps = catalogue.map(item => {
      const photo = templeImages.get(item.slug) || {};

      return {
        updateOne: {
          filter: {
            slug: item.slug
          },

          update: {
            $set: {
              slug: item.slug,
              name: item.name,
              location: item.location,
              deity: item.deity,
              description: item.description,
              isActive: true,

              ...(FETCH_IMAGES
                ? {
                    image: photo.url || "",
                    imageSource: photo.source || "",
                    imagePhotographer:
                      photo.photographer || "",
                    imageLicense: photo.license || ""
                  }
                : {})
            },

            $setOnInsert: {
              history: "",
              openingTime: "06:00",
              closingTime: "21:00",
              image: "",
              createdAt: new Date()
            }
          },

          upsert: true
        }
      };
    });

    await Temple.bulkWrite(templeOps, {
      ordered: false
    });

    const savedTemples = await Temple.find({
      slug: {
        $in: catalogue.map(temple => temple.slug)
      }
    }).lean();

    const templeIds = new Map(
      savedTemples.map(temple => [
        temple.slug,
        temple._id
      ])
    );

    if (savedTemples.length !== 30) {
      throw new Error(
        `Only ${savedTemples.length}/30 temples were saved`
      );
    }

    console.log("30 temples saved successfully");

    // ---------------------------------------
    // 4. INSERT / UPDATE PRODUCTS
    // ---------------------------------------

    const productOps = [];

    for (const temple of catalogue) {
      const templeId = templeIds.get(temple.slug);

      for (const [
        name,
        categoryName,
        description,
        price
      ] of temple.products) {

        const slug =
          `${temple.slug}-${slugify(name)}`;

        const categoryId =
          categoryIds.get(categoryName);

        if (!categoryId) {
          throw new Error(
            `Missing category '${categoryName}' for ${name}`
          );
        }

        if (!templeId) {
          throw new Error(
            `Missing temple reference for ${temple.name}`
          );
        }

        const photo = productImages.get(slug) || {};

        productOps.push({
          updateOne: {
            filter: {
              slug
            },

            update: {
              $set: {
                slug,
                temple: templeId,
                category: categoryId,
                name,
                description,
                price,
                isActive: true,

                ...(FETCH_IMAGES
                  ? {
                      image: photo.url || "",
                      imageSource: photo.source || "",
                      imagePhotographer:
                        photo.photographer || "",
                      imageLicense: photo.license || ""
                    }
                  : {})
              },

              $setOnInsert: {
                image: "",
                stock: DEFAULT_STOCK,
                averageRating: 0,
                totalReviews: 0,
                createdAt: new Date()
              }
            },

            upsert: true
          }
        });
      }
    }

    if (productOps.length !== 60) {
      throw new Error(
        `Expected 60 products, prepared ${productOps.length}`
      );
    }

    await Product.bulkWrite(productOps, {
      ordered: false
    });

    console.log("60 products saved successfully");

    // ---------------------------------------
    // 5. VERIFY DATABASE
    // ---------------------------------------

    const templeCount = await Temple.countDocuments({
      slug: {
        $in: catalogue.map(temple => temple.slug)
      }
    });

    const productCount = await Product.countDocuments({
      temple: {
        $in: [...templeIds.values()]
      }
    });

    const invalidProducts = await Product.countDocuments({
      temple: {
        $in: [...templeIds.values()]
      },

      $or: [
        { category: { $exists: false } },
        { category: null }
      ]
    });

    // ---------------------------------------
    // 6. DISPLAY SUMMARY
    // ---------------------------------------

    console.log(
      "\n========== SACRED HERITAGE SEED SUMMARY =========="
    );

    console.log(`Temples: ${templeCount}/30`);
    console.log(`Products: ${productCount}/60`);
    console.log(`Categories: ${categories.length}`);

    console.log(
      `Products missing category references: ${invalidProducts}`
    );

    console.log(
      `Optional image lookup: ${
        FETCH_IMAGES ? "enabled" : "disabled (fast seed)"
      }`
    );

    console.log(
      "=================================================="
    );

    if (
      templeCount !== 30 ||
      productCount !== 60 ||
      invalidProducts !== 0
    ) {
      throw new Error(
        "Seed verification failed. Check the output and database indexes."
      );
    }

    console.log(
      "\nSacred Heritage database seeded successfully!"
    );

  } finally {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  }
}

seedDatabase().catch(error => {
  console.error("Seed failed:", error);

  process.exitCode = 1;
});