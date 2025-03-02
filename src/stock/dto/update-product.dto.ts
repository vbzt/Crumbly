import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDTO } from "./create-product.dto";


export class UpdateProductDTO extends PartialType(CreateProductDTO){
  
} 