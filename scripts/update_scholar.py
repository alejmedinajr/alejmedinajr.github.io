"""Refresh assets/data/scholar.json from Google Scholar.
Uses SerpAPI when SERPAPI_KEY is set (most reliable from CI), otherwise scholarly."""
import json, os, datetime, urllib.request, urllib.parse

AUTHOR_ID = "nSbbG7gAAAAJ"
OUT = "assets/data/scholar.json"


def from_serpapi(key):
    q = urllib.parse.urlencode({"engine": "google_scholar_author", "author_id": AUTHOR_ID, "api_key": key})
    d = json.load(urllib.request.urlopen("https://serpapi.com/search.json?" + q))
    cites = d["cited_by"]["table"][0]["citations"]["all"]
    h = d["cited_by"]["table"][1]["h_index"]["all"]
    per_year = {str(g["year"]): g["citations"] for g in d["cited_by"].get("graph", [])}
    return len(d.get("articles", [])), cites, h, per_year


def from_scholarly():
    from scholarly import scholarly
    a = scholarly.fill(scholarly.search_author_id(AUTHOR_ID), sections=["indices", "counts", "publications"])
    return len(a["publications"]), a["citedby"], a["hindex"], {str(k): v for k, v in a["cites_per_year"].items()}


pubs, cites, h, per_year = from_serpapi(os.environ["SERPAPI_KEY"]) if os.environ.get("SERPAPI_KEY") else from_scholarly()
with open(OUT, "w") as f:
    json.dump({"updated": datetime.date.today().isoformat(), "publications": pubs, "citations": cites, "h_index": h, "per_year": per_year}, f, indent=2)
    f.write("\n")
print("updated", OUT)
