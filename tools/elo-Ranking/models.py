from dataclasses import dataclass


@dataclass
class Team:
    country: str
    code: str
    flag: str
    elo: float = 1500.0


@dataclass
class Match:
    id: int
    tournament: int
    stage: str
    group: str
    matchday: int
    date: str
    time: str
    city: str
    stadium: str
    home: str
    away: str
    home_goals: int
    home_pens: int
    away_goals: int
    away_pens: int
    status: str

    @property
    def result(self):
        """1 = Heimsieg, 0 = Auswärtssieg, 0.5 = Unentschieden"""
        if self.home_goals > self.away_goals:
            return 1
        elif self.home_goals < self.away_goals:
            return 0
        else:
            return 0.5