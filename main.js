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
  "peackcok",
  "leaping",
  "emperor",
  "dark_staff",
  "light_staff"
]

function fetchData(url) {
  return new Promise(async (res, rej) => {
    const response = await fetch(url)
    const data = await response.json();
    res(data)
  })
}

function renderHits(hits) {
  hits.forEach(listing => {
    renderListing(listing)
  }) 
}

function renderListing(listing) {
  const name = document.createElement("span");
  const price = document.createElement("span")
  const seller = document.createElement("span")
  name.innerText = `${listing.name}: ----- `
  price.innerText = `${listing.bazaar.toLocaleString()} ----- `
  seller.innerText = listing.charname
  document.body.appendChild(name)
  document.body.appendChild(price)
  document.body.appendChild(seller)

  document.body.appendChild(document.createElement("br"))
}

async function init(terms) {
  const listings = await fetchData("https://api.horizonxi.com/api/v1/items/bazaar")
  const hits = listings.filter(listing => terms.some(term => listing.name.includes(term)))
  renderHits(hits)
} 

init(TERMS);
