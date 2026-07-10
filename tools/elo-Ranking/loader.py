import csv

from models import Team, Match


def load_teams(filename):
    teams = {}

    with open(filename, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        for row in reader:
            team = Team(
                country=row["country"],
                code=row["code"],
                flag=row["flag"]
            )

            teams[team.country] = team

    return teams


def load_matches(filename):
    matches = []

    with open(filename, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        for row in reader:
                match = Match(
                    id=int(row["id"]),
                    tournament=int(row["tournament"]),
                    stage=row["stage"],
                    group=row["group"],
                    matchday=int(row["matchday"]),
                    date=row["date"],
                    time=row["time"],
                    city=row["city"],
                    stadium=row["stadium"],
                    home=row["home"],
                    away=row["away"],
                    home_goals=(row["homeGoals"]),
                    home_pens=(row["homePens"]),
                    away_goals=(row["awayGoals"]),
                    away_pens=(row["awayPens"]),
                    status=row["status"]
                )
                if row["status"] == "finished":
                    matches.append(match)

    return matches

