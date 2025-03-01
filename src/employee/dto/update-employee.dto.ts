import { PartialType } from "@nestjs/mapped-types";
import { CreateEmployeeDTO } from "./create-employee.dto";
import { Injectable } from "@nestjs/common";

export class UpdateEmployeeDTO extends PartialType(CreateEmployeeDTO){}