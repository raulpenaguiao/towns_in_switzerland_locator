"""
Fetches Swiss municipalities from Wikidata and writes assets/cards/cards.xml.
Run: python fetch_cities.py
Requires: pip install requests
"""

import requests
import xml.etree.ElementTree as ET
import math

SPARQL_URL = "https://query.wikidata.org/sparql"

QUERY = """
SELECT ?cityLabel ?population ?lat ?lon ?cantonLabel WHERE {
  ?city wdt:P1082 ?population .
  ?city wdt:P625 ?coords .
  ?city wdt:P131 ?canton .
  ?canton wdt:P31 wd:Q23058 .
  BIND(geof:latitude(?coords) AS ?lat)
  BIND(geof:longitude(?coords) AS ?lon)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?population)
LIMIT 1000
"""

def fetch():
    resp = requests.get(
        SPARQL_URL,
        params={"query": QUERY, "format": "json"},
        headers={"User-Agent": "swiss-town-locator/1.0"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["results"]["bindings"]

def build_xml(rows):
    root = ET.Element("Tables")
    cities_el = ET.SubElement(root, "Cities")
    for row in rows:
        city_el = ET.SubElement(cities_el, "City")
        ET.SubElement(city_el, "Name").text       = row["cityLabel"]["value"]
        ET.SubElement(city_el, "Population").text  = row["population"]["value"]
        ET.SubElement(city_el, "Canton").text      = row["cantonLabel"]["value"]
        ET.SubElement(city_el, "NCoordinates").text = f'{float(row["lat"]["value"]):.4f}'
        ET.SubElement(city_el, "ECoordinates").text = f'{float(row["lon"]["value"]):.4f}'
    return root

def indent(el, level=0):
    pad = "\n" + "\t" * level
    if len(el):
        el.text = pad + "\t"
        el.tail = pad
        for child in el:
            indent(child, level + 1)
        child.tail = pad
    else:
        el.tail = pad

def cityEntry(cityLabel, population, cantonLabel, lat, lon):
    return {
        "cityLabel": {"value": str(cityLabel)},
        "population": {"value": str(population)},
        "cantonLabel": {"value": str(cantonLabel)},
        "lat": {"value": str(lat)},
        "lon": {"value": str(lon)},
    }

def removeDuplicates(rows):
    seen = {}
    for row in rows:
        name = row["cityLabel"]["value"]
        if name not in seen:
            seen[name] = cityEntry(
                row["cityLabel"]["value"],
                row["population"]["value"],
                row["cantonLabel"]["value"],
                row["lat"]["value"],
                row["lon"]["value"]
            )
            seen[name]["count"] = 1
        else:
            seen[name]["population"]["value"] = math.floor((int(seen[name]["population"]["value"])*int(seen[name]["count"]) + int(row["population"]["value"]))/(1+int(seen[name]["count"])))
            seen[name]["count"] += 1
    return [cityEntry(
                entry["cityLabel"]["value"],
                entry["population"]["value"],
                entry["cantonLabel"]["value"],
                entry["lat"]["value"],
                entry["lon"]["value"]
            ) for entry in seen.values()]

def treat(rows):
    result = rows [:]
    result = removeDuplicates(result)
    # Remove "Canton of" prefix from canton names
    for row in result:
        name = row["cantonLabel"]["value"]
        if name.startswith("Canton of the "):
            row["cantonLabel"]["value"] = name[len("Canton of the "):]
        elif name.startswith("Canton of "):
            row["cantonLabel"]["value"] = name[len("Canton of "):]
    # sort for population desc
    result.sort(key=lambda r: int(r["population"]["value"]), reverse=True)
    return result

if __name__ == "__main__":
    print("Querying Wikidata...")
    rows = fetch()
    print(f"Got {len(rows)} records.")

    pretreated_rows = treat(rows)
    print(f"Got {len(pretreated_rows)} cities.")
    root = build_xml(pretreated_rows)
    indent(root)
    tree = ET.ElementTree(root)
    ET.indent(tree, space="\t")
    out = "assets/cards/cards.xml"
    tree.write(out, encoding="utf-8", xml_declaration=True)
    print(f"Written to {out}")
