import csv
import os


# ==========================
# Einstellungen
# ==========================

TOURNAMENT = "2022"
GROUP = "B"

OUTPUT = TOURNAMENT+"/"+GROUP+"/standings.html"

MATCH_FILE = "matches.csv"

# ==========================
# Tabelle HTML
# ==========================
def load_team_codes():

    codes = {}

    with open("teams.csv", encoding="utf-8") as file:

        reader = csv.DictReader(file)

        for row in reader:

            codes[row["name"]] = row["code"]

    return codes

# ==========================
# CSV laden
# ==========================

def load_matches():

    matches = []

    with open(MATCH_FILE, encoding="utf-8") as file:

        reader = csv.DictReader(file)

        for row in reader:

            if (
                row["tournament"] == TOURNAMENT
                and row["stage"] == "group"
                and row["group"] == GROUP
            ):

                matches.append(row)

    return matches



# ==========================
# Matchcards erstellen
# ==========================

def create_matchcards(matches):

    html = ""
    codes = load_team_codes()


    for match in matches:

        html += f"""

<div class="match-card"

data-tournament="{match['tournament']}"
data-stage="{match['stage']}"
data-group="{match['group']}"
data-matchday="{match['matchday']}"

>


<div class="match-status">

{match['date']} · {match['time']}

</div>



<div class="teams">


<div class="team">

<img src="../../flags/{codes[match['home']]}.png">

<span>{match['home']}</span>

</div>



<div class="score-home">

{match['homeGoals']}

</div>



<span>:</span>



<div class="score-away">

{match['awayGoals']}

</div>



<div class="team">

<img src="../../flags/{codes[match['away']]}.png">

<span>{match['away']}</span>

</div>


</div>


</div>


"""

    return html


with open(
    "generated/matchcards.html",
    "w",
    encoding="utf-8"
) as file:

    file.write(
        create_matchcards(load_matches())
        )
    
# ==========================
# Tabelle berechnen
# ==========================

def calculate_table(matches):

    table = {}


    for match in matches:


        home = match["home"]
        away = match["away"]


        hg = int(match["homeGoals"])
        ag = int(match["awayGoals"])



        for team in [home, away]:

            if team not in table:

                table[team] = {

                    "games":0,
                    "wins":0,
                    "draws":0,
                    "losses":0,
                    "gf":0,
                    "ga":0,
                    "points":0

                }



        # Spiele

        table[home]["games"] += 1
        table[away]["games"] += 1



        # Tore

        table[home]["gf"] += hg
        table[home]["ga"] += ag

        table[away]["gf"] += ag
        table[away]["ga"] += hg



        # Punkte

        if hg > ag:

            table[home]["wins"] += 1
            table[home]["points"] += 3

            table[away]["losses"] += 1



        elif ag > hg:

            table[away]["wins"] += 1
            table[away]["points"] += 3

            table[home]["losses"] += 1



        else:

            table[home]["draws"] += 1
            table[away]["draws"] += 1

            table[home]["points"] += 1
            table[away]["points"] += 1


    return table





def create_table_html(table):


    codes = load_team_codes()
    ranking = sorted(

        table.items(),

        key=lambda x:(

            x[1]["points"],

            x[1]["gf"] - x[1]["ga"],

            x[1]["gf"]

        ),

        reverse=True

    )


    html = """

<table class="standings">

<thead>

<tr>

<th>#</th>
<th>Team</th>
<th>Sp</th>
<th>S</th>
<th>U</th>
<th>N</th>
<th>Tore</th>
<th>Pkt</th>

</tr>

</thead>


"""


    position = 1


    for team,data in ranking:


        html += f"""

<tr>


<td>{position}</td>


<td class="table-team">

<img src="../../flags/{codes[team]}.png" style="height: 12px;width: auto;">

{team}

</td>


<td>{data['games']}</td>

<td>{data['wins']}</td>

<td>{data['draws']}</td>

<td>{data['losses']}</td>


<td>

{data['gf']}:{data['ga']}

</td>


<td>

<b>{data['points']}</b>

</td>


</tr>


"""


        position += 1



    html += "</table>"


    return html




# ==========================
# HTML Seite erzeugen
# ==========================

def create_page(matches_html, table_html):


    page = f"""

{table_html}


"""


    return page



# ==========================
# Start
# ==========================

matches = load_matches()


matches_html = create_matchcards(matches)


table = calculate_table(matches)


table_html = create_table_html(table)



os.makedirs(
    os.path.dirname(OUTPUT),
    exist_ok=True
)


with open(
    OUTPUT,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        create_page(
            matches_html,
            table_html
        )
    )


print("Gruppe erstellt:", OUTPUT)