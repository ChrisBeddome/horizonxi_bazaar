const TERMS = [
  "haub",
  "scorpion_ha",
  "sniper",
  "archers_rin",
  "damas",
  "vermill",
  "royal_cl",
  "enlight",
  "amemet_man",
  "cassie",
  "hercule",
  "mermaid",
  "astral_ear",
  "viking",
  "woodsman",
  "buckler_ear",
  "gigant",
  "torea",
  "serket",
  "knightly_ma",
  "peacock",
  "leaping",
  "emperor",
  "dark_staff",
  "light_staff",
  "darksteel_maul_+1",
  "walkure",
  "valkyrie",
  "hades_earr",
  "assault_ear",
  "bloodbead_ear",
  "ochiud",
  "horomush",
  "fuma_ky",
  "venomous"
]

function fetchData(url) {
  return new Promise(async (res, rej) => {
    const response = await fetch(url)
    const data = await response.json();
    res(data)
  })
}

function renderHits(hits) {
  const resultsUl = document.getElementById("results");
  for (key in hits) {
    hits[key].forEach((listing, i) => {
      renderListing(resultsUl, key, listing, i == 0)
    }) 
    if (Object.keys(hits).indexOf(key) < Object.keys(hits).length - 1) {
      resultsUl.innerHTML += "<hr/>"
    }
  }
}

function renderListing(container, key, listing, renderName) {
  const listingHTML = listingRowTemplate(listing, key, renderName);
  container.innerHTML += listingHTML;
}

function listingRowTemplate(listing, key, renderName) {
  return `
    <li>
      <div>${renderName ? formatName(key) : ""}</div>
      <div>${listing.price.toLocaleString()}</div>
      <div>${listing.seller}</div>
    </li>
  `;
}

function formatName(name) {
  return name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function filterResults(listings, terms) {
  return listings.filter(listing => terms.some(term => listing.name.includes(term)))
}

function formatListings(listings) {
  const uniqueNames = new Set(listings.map(listing => listing.name))
  const listingsHash = {}
  Array.from(uniqueNames).sort().forEach(name => {
    listingsHash[name] = listings.filter(listing => listing.name == name).map(listing => ({price: listing.bazaar, seller: listing.charname }))
  })
  return listingsHash
}

async function update(terms) {
  console.log("updating")
  const listings = await fetchData("https://api.horizonxi.com/api/v1/items/bazaar")
  const resultsUl = document.getElementById("results")
  resultsUl.innerHTML = "";
  const hits = filterResults(listings, terms)
  formattedHits = formatListings(hits)
  renderHits(formattedHits)
} 

update(TERMS);
setInterval(update.bind(null, TERMS), 30000)
