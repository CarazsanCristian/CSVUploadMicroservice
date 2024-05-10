import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  itemId!: number;

  @Column("varchar", { length: 50 })
  productName!: string;

  @Column("varchar", { length: 60 })
  category!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "int" })
  price!: number;
}
