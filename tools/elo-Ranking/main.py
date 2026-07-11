import csv

from loader import load_teams, load_matches

teams = load_teams("../../data/teams.csv")
matches = load_matches("../../data/matches.csv")


print(f"{len(teams)} Teams geladen.")
print(f"{len(matches)} Spiele geladen.")

print()

# Erstes Team
print(next(iter(teams.values())))

print()

# Erstes Spiel
match = matches[1]

print(match.home)
print(match.away)
print(match.home_goals, "-", match.away_goals)
print("Result:", match.result)
import csv

stats = {}

for team in teams.values():

    stats[team.country] = {

        "highscore": team.elo,
        "lowscore": team.elo,

        "highest_rank": 999,
        "lowest_rank": 0,

        "weeks_first": 0,
        "weeks_top3": 0,

        "largest_gain": 0,
        "largest_loss": 0,

        "previous_elo": team.elo

    }
    
    history = []
snapshot = 0
last_state = None
def calculatePoints(winnerPoints,loserPoints,winnerGoals,loserGoals,W):
    K = 60
    N = abs(int(winnerGoals) - int(loserGoals))
    G = (11+N)/8
    if N == 1 or N == 0:
        G = 1
    if N == 2:
        G = 1.5
    dr = winnerPoints - loserPoints
    We = 1/(10**(-dr/400)+1)
    P = K*G*(W-We)
    return P

for i, match in enumerate(matches):

    if match.status != "finished":
        continue

    home = teams[match.home]
    away = teams[match.away]

    homeelo = home.elo
    awayelo = away.elo

    # -------------------------
    # Elo aktualisieren
    # -------------------------

    if match.home_goals > match.away_goals:

        home.elo += calculatePoints(
            homeelo,
            awayelo,
            match.home_goals,
            match.away_goals,
            1
        )

        away.elo += calculatePoints(
            awayelo,
            homeelo,
            match.away_goals,
            match.home_goals,
            0
        )

    elif match.home_goals < match.away_goals:

        home.elo += calculatePoints(
            homeelo,
            awayelo,
            match.home_goals,
            match.away_goals,
            0
        )

        away.elo += calculatePoints(
            awayelo,
            homeelo,
            match.away_goals,
            match.home_goals,
            1
        )

    else:

        home.elo += calculatePoints(
            homeelo,
            awayelo,
            match.home_goals,
            match.away_goals,
            0.5
        )

        away.elo += calculatePoints(
            awayelo,
            homeelo,
            match.away_goals,
            match.home_goals,
            0.5
        )
    # -------------------------
    # Snapshot speichern
    # -------------------------

    current = (
        match.tournament,
        match.stage.strip(),
        match.matchday
    )
    save_snapshot = False

    if i == len(matches)-1:

        save_snapshot = True

    else:

        next_match = matches[i+1]

        next_state = (
            next_match.tournament,
            next_match.stage,
            next_match.matchday
        )

        if current != next_state:

            save_snapshot = True
        
    if save_snapshot:

        snapshot += 1

        ranking = sorted(
            teams.values(),
            key=lambda t: t.elo,
            reverse=True
        )


        for rank, team in enumerate(ranking, start=1):

            s = stats[team.country]

            # Höchste Elo
            s["highscore"] = max(s["highscore"], team.elo)

            # Niedrigste Elo
            s["lowscore"] = min(s["lowscore"], team.elo)

            # Beste Platzierung
            s["highest_rank"] = min(s["highest_rank"], rank)

            # Schlechteste Platzierung
            s["lowest_rank"] = max(s["lowest_rank"], rank)

            # Anzahl Führungen
            if rank == 1:
                s["weeks_first"] += 1

            # Top 3
            if rank <= 3:
                s["weeks_top3"] += 1

            # Größter Gewinn/Verlust
            delta = team.elo - s["previous_elo"]

            s["largest_gain"] = max(s["largest_gain"], delta)
            s["largest_loss"] = min(s["largest_loss"], delta)

            s["previous_elo"] = team.elo

            # Elo-History speichern
            history.append([
                snapshot,
                current[0],
                current[1],
                current[2],
                team.country,
                rank,
                round(team.elo)
            ])            
    with open("../../data/elo_history.csv",
        "w",
        newline="",
        encoding="utf-8") as file:

        writer = csv.writer(file)

        writer.writerow([
            "snapshot",
            "tournament",
            "stage",
            "matchday",
            "team",
            "rank",
            "elo"
        ])

        writer.writerows(history)
        with open("../../data/elo_stats.csv","w",newline="",encoding="utf-8") as file:

            writer = csv.writer(file)

            writer.writerow([
                "team",
                "highscore",
                "lowscore",
                "highest_rank",
                "lowest_rank",
                "weeks_first",
                "weeks_top3",
                "largest_gain",
                "largest_loss"
            ])

            for team, s in stats.items():

                writer.writerow([
                    team,
                    round(s["highscore"]),
                    round(s["lowscore"]),
                    s["highest_rank"],
                    s["lowest_rank"],
                    s["weeks_first"],
                    s["weeks_top3"],
                    round(s["largest_gain"]),
                    round(s["largest_loss"])
                ])

print("elo_history.csv erstellt.")
# Rangliste ausgeben
ranking = sorted(teams.values(), key=lambda team: team.elo, reverse=True)

for i, team in enumerate(ranking, start=1):
    print(f"{i:2}. {team.country:30} {team.elo:.0f}")

# Rangliste erzeugen
ranking = sorted(
    teams.values(),
    key=lambda team: team.elo,
    reverse=True
)

# CSV schreiben
with open("../../data/elo.csv", "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    # Kopfzeile
    writer.writerow(["rank", "team", "elo"])

    # Daten
    for rank, team in enumerate(ranking, start=1):

        writer.writerow([
            rank,
            team.country,
            round(team.elo)
        ])

print("elo.csv erfolgreich erstellt.")

key = tuple(sorted([match.home, match.away]))
headtohead = {}

teamstats = {}

for match in matches:
    if match.status != "finished":
        continue
    key = tuple(sorted([match.home,match.away]))

    if key not in headtohead:
        print("NEU:", key)
        headtohead[key] = {
            "team1": key[0],
            "team2": key[1],
            "games":0,
            "wins1":0,
            "wins2":0,
            "draws":0,

            "goals1":0,
            "goals2":0,

            "first":match.tournament,
            "last":match.tournament
        }
    
    h = headtohead[key]
    h["games"] += 1
    if match.home == h["team1"]:
        goals1 = int(match.home_goals)
        goals2 = int(match.away_goals)
    else:
        goals1 = int(match.away_goals)
        goals2 = int(match.home_goals)
    h["goals1"] += goals1
    h["goals2"] += goals2
    if goals1 > goals2:
        h["wins1"] += 1
    elif goals2 > goals1:
        h["wins2"] += 1
    else:
        h["draws"] += 1
    h["last"] = match.tournament

print(list(headtohead.keys())[:5])
# CSV schreiben
with open("../../data/headtohead.csv", "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    # Kopfzeile
    writer.writerow(["games","team1", "team2", "games", "wins1", "draws", "wins2", "goals1", "goals2", "first", "last"])

    # Daten
    for hth in headtohead.values():

        writer.writerow([
            hth["games"],
            hth["team1"],
            hth["team2"],
            hth["wins1"],
            hth["draws"],
            hth["wins2"],
            hth["goals1"],
            hth["goals2"],
            hth["first"],
            hth["last"],
            ])

print("headtohead.csv erfolgreich erstellt.")
