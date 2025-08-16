from typing import List
from pydantic import BaseModel, Field, model_validator


class Objeto(BaseModel):
    nombre: str = Field(min_length=1, description="ID del proyecto")
    peso: int = Field(ge=0, description="Costo requerido (entero)")
    ganancia: int = Field(ge=0, description="Beneficio esperado (entero)")


class OptRequest(BaseModel):
    capacidad: int = Field(ge=0, description="Límite presupuestario total")
    objetos: List[Objeto]

    @model_validator(mode="after")
    def validar(self):
        nombres = [o.nombre for o in self.objetos]
        if len(nombres) != len(set(nombres)):
            raise ValueError("Los nombres de proyectos deben ser únicos.")
        return self


class OptResponse(BaseModel):
    seleccionados: List[str]
    ganancia_total: int
    peso_total: int
