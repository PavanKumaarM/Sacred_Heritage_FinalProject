// Source catalogue: 30 temples and 60 products
const catalogue = [
  {
    name: "Meenakshi Amman Temple",
    slug: "meenakshi-amman-temple",
    location: "Madurai, Tamil Nadu",
    deity: "Goddess Meenakshi and Lord Sundareswarar",
    description: "Historic temple renowned for its Dravidian architecture and magnificent gopurams.",
    products: [
      ["Madurai Kumkum", "Pooja Items", "Traditional kumkum for devotional use.", 50],
      ["Brass Pooja Lamp", "Pooja Items", "Traditional brass lamp for home worship.", 450]
    ]
  },
  {
    name: "Brihadeeswarar Temple",
    slug: "brihadeeswarar-temple",
    location: "Thanjavur, Tamil Nadu",
    deity: "Lord Shiva",
    description: "UNESCO-listed Great Living Chola Temple, famous for its monumental vimana.",
    products: [
      ["Nandi Brass Idol", "Devotional Items", "Decorative Nandi idol.", 550],
      ["Shiva Lingam Idol", "Devotional Items", "Decorative Shiva Lingam for worship.", 350]
    ]
  },
  {
    name: "Ramanathaswamy Temple",
    slug: "ramanathaswamy-temple",
    location: "Rameswaram, Tamil Nadu",
    deity: "Lord Shiva",
    description: "Sacred pilgrimage temple famous for its long pillared corridors.",
    products: [
      ["Rudraksha Mala", "Devotional Items", "Prayer beads for devotional practices.", 200],
      ["Rameswaram Conch", "Devotional Items", "Decorative devotional conch.", 250]
    ]
  },
  {
    name: "Kapaleeshwarar Temple",
    slug: "kapaleeshwarar-temple",
    location: "Mylapore, Chennai",
    deity: "Lord Shiva",
    description: "Historic Mylapore Shiva temple known for its colourful gopuram.",
    products: [
      ["Shiva Nandi Idol", "Devotional Items", "Decorative Nandi idol.", 350],
      ["Rudraksha Bracelet", "Jewellery", "Traditional rudraksha bracelet.", 180]
    ]
  },
  {
    name: "Palani Murugan Temple",
    slug: "palani-murugan-temple",
    location: "Palani, Dindigul",
    deity: "Lord Dhandayuthapani",
    description: "One of the six sacred Arupadai Veedu temples of Lord Murugan.",
    products: [
      ["Palani Panchamirtham", "Prasadam", "Traditional Palani-style Panchamirtham.", 150],
      ["Murugan Vel", "Devotional Items", "Decorative Murugan Vel.", 250]
    ]
  },
  {
    name: "Arunachaleswarar Temple",
    slug: "arunachaleswarar-temple",
    location: "Tiruvannamalai",
    deity: "Lord Shiva",
    description: "Famous Shiva temple associated with the element of fire and Karthigai Deepam.",
    products: [
      ["Deepam Brass Lamp", "Pooja Items", "Traditional brass lamp.", 400],
      ["Shiva Photo Frame", "Devotional Items", "Devotional wall photograph.", 200]
    ]
  },
  {
    name: "Sri Ranganathaswamy Temple",
    slug: "srirangam-ranganathaswamy",
    location: "Srirangam, Tiruchirappalli",
    deity: "Lord Ranganatha",
    description: "Major Vaishnavite pilgrimage centre known for its large temple complex.",
    products: [
      ["Vishnu Photo Frame", "Devotional Items", "Lord Vishnu devotional photo.", 200],
      ["Tulsi Mala", "Devotional Items", "Traditional Tulsi prayer beads.", 150]
    ]
  },
  {
    name: "Chidambaram Nataraja Temple",
    slug: "chidambaram-nataraja",
    location: "Chidambaram, Cuddalore",
    deity: "Lord Nataraja",
    description: "Famous temple dedicated to Lord Shiva in the cosmic dancing form.",
    products: [
      ["Nataraja Brass Idol", "Devotional Items", "Decorative Nataraja idol.", 750],
      ["Shiva Wall Art", "Home Decor", "Nataraja devotional artwork.", 300]
    ]
  },
  {
    name: "Ekambareswarar Temple",
    slug: "ekambareswarar-temple",
    location: "Kanchipuram",
    deity: "Lord Shiva",
    description: "Ancient temple associated with the earth element.",
    products: [
      ["Shiva Lingam Idol", "Devotional Items", "Decorative Shiva Lingam.", 350],
      ["Brass Pooja Bell", "Pooja Items", "Traditional brass worship bell.", 180]
    ]
  },
  {
    name: "Kamakshi Amman Temple",
    slug: "kamakshi-amman-temple",
    location: "Kanchipuram",
    deity: "Goddess Kamakshi",
    description: "Important Shakti pilgrimage centre in Kanchipuram.",
    products: [
      ["Kamakshi Amman Photo", "Devotional Items", "Goddess Kamakshi devotional photo.", 180],
      ["Kumkum Box", "Pooja Items", "Decorative kumkum container.", 120]
    ]
  },
  {
    name: "Jambukeswarar Temple",
    slug: "jambukeswarar-temple",
    location: "Thiruvanaikaval, Tiruchirappalli",
    deity: "Lord Shiva",
    description: "One of the Pancha Bhoota temples associated with water.",
    products: [
      ["Shiva Nandi Idol", "Devotional Items", "Decorative Nandi idol.", 350],
      ["Brass Diya", "Pooja Items", "Traditional oil lamp.", 250]
    ]
  },
  {
    name: "Airavatesvara Temple",
    slug: "airavatesvara-temple",
    location: "Darasuram, Thanjavur",
    deity: "Lord Shiva",
    description: "UNESCO-listed Chola temple celebrated for its stone architecture.",
    products: [
      ["Chola Temple Miniature", "Souvenirs", "Decorative temple miniature.", 500],
      ["Temple Architecture Book", "Books", "Illustrated temple architecture book.", 350]
    ]
  },
  {
    name: "Gangaikonda Cholapuram Temple",
    slug: "gangaikonda-cholapuram",
    location: "Ariyalur, Tamil Nadu",
    deity: "Lord Shiva",
    description: "Historic Chola temple built by Rajendra Chola I.",
    products: [
      ["Chola Architecture Model", "Souvenirs", "Decorative architecture miniature.", 450],
      ["Shiva Photo Frame", "Devotional Items", "Devotional Shiva photograph.", 200]
    ]
  },
  {
    name: "Shore Temple",
    slug: "mahabalipuram-shore-temple",
    location: "Mahabalipuram, Chengalpattu",
    deity: "Lord Shiva and Lord Vishnu",
    description: "Historic Pallava-era coastal temple and UNESCO World Heritage site.",
    products: [
      ["Stone Temple Miniature", "Souvenirs", "Decorative stone-style miniature.", 450],
      ["Pallava Architecture Book", "Books", "Book about Pallava architecture.", 350]
    ]
  },
  {
    name: "Varadaraja Perumal Temple",
    slug: "varadaraja-perumal-temple",
    location: "Kanchipuram",
    deity: "Lord Vishnu",
    description: "Important Vaishnavite temple in Kanchipuram.",
    products: [
      ["Vishnu Brass Idol", "Devotional Items", "Decorative Vishnu idol.", 550],
      ["Tulsi Mala", "Devotional Items", "Traditional Tulsi prayer beads.", 150]
    ]
  },
  {
    name: "Parthasarathy Temple",
    slug: "parthasarathy-temple",
    location: "Triplicane, Chennai",
    deity: "Lord Krishna",
    description: "Historic Vishnu temple dedicated to Lord Parthasarathy.",
    products: [
      ["Krishna Photo Frame", "Devotional Items", "Lord Krishna devotional photograph.", 200],
      ["Tulsi Prayer Mala", "Devotional Items", "Traditional Tulsi beads.", 150]
    ]
  },
  {
    name: "Vadapalani Murugan Temple",
    slug: "vadapalani-murugan-temple",
    location: "Vadapalani, Chennai",
    deity: "Lord Murugan",
    description: "Popular Murugan temple in Chennai.",
    products: [
      ["Murugan Vel", "Devotional Items", "Decorative Murugan Vel.", 250],
      ["Murugan Photo Frame", "Devotional Items", "Lord Murugan devotional photograph.", 180]
    ]
  },
  {
    name: "Tiruchendur Murugan Temple",
    slug: "tiruchendur-murugan-temple",
    location: "Tiruchendur, Thoothukudi",
    deity: "Lord Murugan",
    description: "Coastal Murugan temple and one of the six Arupadai Veedu.",
    products: [
      ["Murugan Vel Pendant", "Jewellery", "Devotional Vel pendant.", 180],
      ["Murugan Brass Idol", "Devotional Items", "Decorative Murugan idol.", 450]
    ]
  },
  {
    name: "Swamimalai Murugan Temple",
    slug: "swamimalai-murugan-temple",
    location: "Swamimalai, Thanjavur",
    deity: "Lord Swaminathaswamy",
    description: "One of the six Arupadai Veedu temples.",
    products: [
      ["Murugan Brass Idol", "Devotional Items", "Decorative Murugan idol.", 450],
      ["Vel Pooja Pendant", "Jewellery", "Decorative Vel pendant.", 180]
    ]
  },
  {
    name: "Thiruthani Murugan Temple",
    slug: "thiruthani-murugan-temple",
    location: "Thiruthani, Tiruvallur",
    deity: "Lord Murugan",
    description: "One of the six sacred Arupadai Veedu temples.",
    products: [
      ["Murugan Photo Frame", "Devotional Items", "Murugan devotional photograph.", 180],
      ["Brass Vel", "Devotional Items", "Decorative brass Vel.", 350]
    ]
  },
  {
    name: "Pillayarpatti Karpaga Vinayagar Temple",
    slug: "pillayarpatti-vinayagar-temple",
    location: "Pillayarpatti, Sivaganga",
    deity: "Lord Karpaga Vinayagar",
    description: "Famous rock-cut cave temple dedicated to Ganesha.",
    products: [
      ["Ganesha Brass Idol", "Devotional Items", "Decorative Ganesha idol.", 450],
      ["Ganesha Wall Frame", "Devotional Items", "Ganesha devotional photograph.", 200]
    ]
  },
  {
    name: "Suchindram Thanumalayan Temple",
    slug: "suchindram-thanumalayan-temple",
    location: "Suchindram, Kanyakumari",
    deity: "Trimurti: Shiva, Vishnu and Brahma",
    description: "Historic temple known for its musical pillars and large Hanuman statue.",
    products: [
      ["Anjaneya Photo Frame", "Devotional Items", "Hanuman devotional photograph.", 200],
      ["Brass Temple Bell", "Pooja Items", "Traditional brass bell.", 180]
    ]
  },
  {
    name: "Srivilliputhur Andal Temple",
    slug: "srivilliputhur-andal-temple",
    location: "Srivilliputhur, Virudhunagar",
    deity: "Goddess Andal and Lord Vatapatrasayi",
    description: "Historic Divya Desam associated with Andal.",
    products: [
      ["Andal Photo Frame", "Devotional Items", "Goddess Andal devotional photo.", 200],
      ["Tulsi Mala", "Devotional Items", "Traditional Tulsi beads.", 150]
    ]
  },
  {
    name: "Alagar Kovil",
    slug: "alagar-kovil",
    location: "Alagar Hills, Madurai",
    deity: "Lord Kallazhagar",
    description: "Historic Vishnu temple located in the Alagar Hills.",
    products: [
      ["Vishnu Brass Idol", "Devotional Items", "Decorative Vishnu idol.", 450],
      ["Tulsi Prayer Mala", "Devotional Items", "Traditional Tulsi beads.", 150]
    ]
  },
  {
    name: "Nellaiappar Temple",
    slug: "nellaiappar-temple",
    location: "Tirunelveli",
    deity: "Lord Shiva and Goddess Kanthimathi",
    description: "Historic twin shrine complex famous for its musical pillars.",
    products: [
      ["Shiva Photo Frame", "Devotional Items", "Lord Shiva photograph.", 200],
      ["Brass Deepam", "Pooja Items", "Traditional brass lamp.", 350]
    ]
  },
  {
    name: "Kanyakumari Bhagavathi Amman Temple",
    slug: "kanyakumari-bhagavathi-amman",
    location: "Kanyakumari",
    deity: "Goddess Bhagavathi Amman",
    description: "Famous coastal temple dedicated to the Goddess.",
    products: [
      ["Amman Kumkum", "Pooja Items", "Traditional kumkum.", 50],
      ["Amman Photo Frame", "Devotional Items", "Goddess devotional photograph.", 200]
    ]
  },
  {
    name: "Marudhamalai Murugan Temple",
    slug: "marudhamalai-murugan-temple",
    location: "Coimbatore",
    deity: "Lord Murugan",
    description: "Popular hill temple dedicated to Lord Murugan.",
    products: [
      ["Murugan Vel", "Devotional Items", "Decorative Murugan Vel.", 250],
      ["Murugan Brass Idol", "Devotional Items", "Decorative Murugan idol.", 450]
    ]
  },
  {
    name: "Namakkal Anjaneyar Temple",
    slug: "namakkal-anjaneyar-temple",
    location: "Namakkal",
    deity: "Lord Hanuman",
    description: "Famous temple featuring a tall monolithic Anjaneyar statue.",
    products: [
      ["Hanuman Photo Frame", "Devotional Items", "Hanuman devotional photograph.", 200],
      ["Hanuman Brass Idol", "Devotional Items", "Decorative Hanuman idol.", 450]
    ]
  },
  {
    name: "Suryanar Koil",
    slug: "suryanar-koil",
    location: "Thirumangalakudi, Thanjavur district",
    deity: "Lord Surya",
    description: "Important Navagraha temple dedicated to the Sun deity.",
    products: [
      ["Surya Dev Photo Frame", "Devotional Items", "Sun deity devotional photograph.", 200],
      ["Brass Pooja Diya", "Pooja Items", "Traditional brass diya.", 250]
    ]
  },
  {
    name: "Thirunageswaram Naganathaswamy Temple",
    slug: "thirunageswaram-naganathaswamy",
    location: "Thirunageswaram, Kumbakonam",
    deity: "Lord Shiva and Rahu",
    description: "Famous Navagraha temple associated with Rahu.",
    products: [
      ["Naga Devata Idol", "Devotional Items", "Decorative serpent deity idol.", 350],
      ["Shiva Lingam Photo", "Devotional Items", "Shiva devotional photograph.", 180]
    ]
  }
];

module.exports = catalogue;