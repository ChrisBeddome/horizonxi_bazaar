(function (){
  const TERMS = [
    "haub",
    "scorpion_ha",
    "sniper",
    "archers_rin",
    "damas",
    "vermill",
    "royal_cl",
    "enlight",
    // "amemet_man",
    "cassie",
    "hercules_ring",
    "mermaid",
    "astral_ear",
    // "viking_shie",
    // "woodsman",
    "buckler_ear",
    "gigant_mant",
    "torea",
    "serket",
    // "knightly_ma",
    // "peacock",
    // "leaping",
    // "emperor",
    // "dark_staff",
    // "light_staff",
    // "darksteel_maul_+1",
    "walkure",
    "valkyrie",
    "hades_earr",
    "assault_ear",
    "bloodbead_ear",
    "ochiud",
    "horomush",
    "fuma_ky",
    "venomous",
    "spiked_finger",
    "warwolf",
    "tatami",
    "tiphia",
    "hakutaku_eye_cluster",
    "rosenbog",
    // "fomor_cod",
    "triumph_ear",
    // "minstrels_ring",
    // "espadon_+1",
    "company_sword",
    "nomads_mantle_+1",
    "vigor_ring",
    "victory_ring",
    "bomb_queen",
    "gem_"
  ]

  const state = {
    listings: [],
    cheapestOnly: true
  }

  function fetchData(url) {
    return new Promise(async (res, rej) => {
      const response = await fetch(url)
      const data = await response.json();
      res(data)
    })
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

  function hits() {
    return state.listings.filter(listing => TERMS.some(term => listing.name.includes(term)))
  }

  function formatListings(listings) {
    const uniqueNames = new Set(listings.map(listing => listing.name))
    const listingsHash = {}
    Array
      .from(uniqueNames)
      .sort()
      .forEach( name => {
        listingsHash[name] = listings
                              .filter(listing => listing.name == name)
                              .map(listing => ({price: listing.bazaar, seller: listing.charname }))
    })
    if (state.cheapestOnly) {
      for (key in listingsHash)  {
        listingsHash[key] = listingsHash[key].sort((a, b) => a.price - b.price).slice(0,1)
      }
    }
    return listingsHash
  }

  function render() {
    const listings = formatListings(hits())
    const resultsUl = document.getElementById("results")
    resultsUl.innerHTML = "";
    for (key in listings) {
      listings[key].forEach((listing, i) => {
        renderListing(resultsUl, key, listing, i == 0)
      }) 
      if (Object.keys(listings).indexOf(key) < Object.keys(listings).length - 1) {
        resultsUl.innerHTML += "<hr/>"
      }
    }
  }

  async function update() {
    state.listings = await fetchData("https://api.horizonxi.com/api/v1/items/bazaar")
  } 

  async function init() {
    await update()
    const cheapestOnlyToggle = document.getElementById("cheapestOnlyToggle")
    cheapestOnlyToggle.checked = state.cheapestOnly
    cheapestOnlyToggle.addEventListener("change", e => {
      state.cheapestOnly = e.target.checked
      render()
    })
    render()
  }

  init();
})();
