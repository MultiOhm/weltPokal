import csv

team_file = "../data/teams.csv"
input_file = "kitcards.csv"
output_file = "../data/generated/kitcards.html"

html = ""

def findTeam(code):
    with open(team_file, newline="", encoding="utf-8") as csvteamfile:
        reader = csv.DictReader(csvteamfile)

        for row in reader:
            if row["flag"] == code:
                return row["country"]

with open(input_file, newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        country = row["country"]
        year = row["jahr"]
        kit_type = row["type"]
        texture = row["texture"]

        # Ländername optional über Mapping
    

        country_name = findTeam(country)

        card = f"""
<div class="kit-card"
     data-team="{country_name}"
     data-country="{country}"
     data-year="{year}"
     data-type="{kit_type}"
     data-render="{texture}">

    <img class="kit-render"
         src="renders/{texture}">

    <div class="kit-info">

        <div class="country">
            <img src="flags/{country}.png">
            {country_name}
        </div>

        <div class="meta">
            {kit_type.upper()} • {year}
        </div>

    </div>

</div>
"""

        html += card


with open(output_file, "w", encoding="utf-8") as file:
    file.write(html)


input("Fertig! kits.html wurde erstellt.")