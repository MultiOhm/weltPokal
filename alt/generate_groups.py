import csv


def create_group_page(group_id):

    matches = []

    with open("data/matches.csv", encoding="utf-8") as file:

        reader = csv.DictReader(file)

        for row in reader:

            if row["turnier"] == group_id:
                matches.append(row)


    html = """
<!DOCTYPE html>

<html>

<head>

<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/group.css">

</head>

<body>


<div class="group-layout">


<div class="matches-list">

<h1>Gruppe A</h1>

"""


    for game in matches:

        html += f"""

<div class="group-match">


    <div class="group-team home">

        <img src="../flags/{game['heim_flag']}.png">

        {game['heim']}

    </div>


    <div class="group-score">

        {game['tore_heim']}:{game['tore_auswaerts']}

    </div>


    <div class="group-team away">

        {game['auswaerts']}

        <img src="../flags/{game['auswaerts_flag']}.png">

    </div>


</div>

"""


    html += """

</div>


<div class="table">

<h2>Tabelle</h2>

<!-- Tabelle kommt hier später -->

</div>


</div>


</body>

</html>

"""


    with open(
        f"gruppen/gruppe_{group_id}.html",
        "w",
        encoding="utf-8"
    ) as file:

        file.write(html)



create_group_page("2022_a")