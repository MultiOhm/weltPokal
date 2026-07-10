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
    print(
        match.id,
        match.tournament,
        match.stage,
        repr(match.matchday)
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

