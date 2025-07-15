# {{MODULE_NAME}}: SERVICE logic
from typing import List
from uuid import UUID

from .repository import Repository
from .model import {{MODULE_NAME_UPPER}}

class Service:
    """Business‑logic layer; stays persistence‑agnostic."""

    def __init__(self, repo: Repository) -> None:
        self.repo = repo

    def create(self, m: {{MODULE_NAME_UPPER}}) -> {{MODULE_NAME_UPPER}}:
        return self.repo.create(m)

    def find_by_id(self, id: UUID) -> {{MODULE_NAME_UPPER}} | None:
        return self.repo.find_by_id(id)

    def list(self) -> List[{{MODULE_NAME_UPPER}}]:
        return self.repo.list()

    def update(self, m: {{MODULE_NAME_UPPER}}) -> {{MODULE_NAME_UPPER}}:
        return self.repo.update(m)

    def delete(self, id: UUID) -> None:
        self.repo.delete(id)
