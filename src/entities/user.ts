import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  userId!: number;

  @Column("varchar", { length: 50, unique: true })
  username!: string;

  @Column("varchar", { length: 60 })
  password!: string;

  static createUser(username: string, password: string) {
    return this.create({
      username,
      password,
    }).save();
  }

  static getUserById(userId: number) {
    return this.findOneOrFail({
      select: {
        password: false,
      },
      where: {
        userId,
      },
    }).catch(() => {
      throw new Error("No user found");
    });
  }

  static getUserByUsername(username: string) {
    return this.findOne({
      where: [{ username }],
    });
  }
}
