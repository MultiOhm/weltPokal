import csv

input_file = "kitcards.csv"
output_file = "../data/generated/kitcards.html"

html = ""

with open(input_file, newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        country = row["country"]
        year = row["jahr"]
        kit_type = row["type"]
        texture = row["texture"]

        # Ländername optional über Mapping
        countries = {
            "pt": "Portugal",
            "mx": "Mexiko",
            "jp": "Japan",
            "uy": "Uruguay",
            "co": "Kolumbien",
"be": "Belgien",
"hr": "Kroatien",
"br": "Brasilien",
"en": "England",
"ar": "Argentinien",
"ir": "IR Iran",
        }

        country_name = countries.get(country, country.upper())

        card = f"""
<div class="kit-card"
     data-team="{country_name}"
     data-country="{country}"
     data-year="{year}"
     data-type="{kit_type}">

    <img class="kit-render"
         src="renders/{texture}">

    <div class="kit-info">

        <div class="country">
            <img src="flags/{country}.png">
            {country_name}
        </div>

        <div class="meta">
            {kit_type.capitalize()} • <br>{country_name} {year}
        </div>

    </div>

</div>
"""

        html += card


with open(output_file, "w", encoding="utf-8") as file:
    file.write(html)


input("Fertig! kits.html wurde erstellt.")