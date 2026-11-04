const API = "https://commons.wikimedia.org/w/api.php";

// Optional image lookup. Seeding does not depend on Wikimedia availability.
async function findCommonsImage(searchTerm) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: searchTerm,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|extmetadata"
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API}?${params}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SacredHeritageStudentProject/1.0 (educational use)"
      }
    });

    if (!response.ok) {
      throw new Error(`Wikimedia HTTP ${response.status}`);
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});

    const match = pages.find(page => {
      const info = page.imageinfo?.[0];
      return info?.url && !/\.(svg|gif)$/i.test(info.url);
    });

    if (!match) {
      return {
        url: "",
        source: "",
        photographer: "",
        license: ""
      };
    }

    const info = match.imageinfo[0];
    const meta = info.extmetadata || {};

    return {
      url: info.url || "",
      source: info.descriptionurl || "",
      photographer: meta.Artist?.value || "",
      license: meta.LicenseShortName?.value || ""
    };

  } catch (error) {
    console.warn(
      `Image lookup skipped for '${searchTerm}': ${error.message}`
    );

    return {
      url: "",
      source: "",
      photographer: "",
      license: ""
    };

  } finally {
    clearTimeout(timeout);
  }
}

// Run multiple image requests without overwhelming Wikimedia.
async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (true) {
        const index = next++;

        if (index >= items.length) return;

        results[index] = await worker(items[index], index);
      }
    }
  );

  await Promise.all(workers);

  return results;
}

module.exports = {
  findCommonsImage,
  mapWithConcurrency
};