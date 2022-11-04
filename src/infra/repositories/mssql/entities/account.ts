import crypto from 'crypto'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'accounts', synchronize: false })
export class AccountModel {
  @PrimaryColumn({ type: 'varchar' })
    id: string

  @Column({ type: 'varchar' })
    name: string

  @Column({ type: 'varchar' })
    password: string

  @Column({ type: 'varchar' })
    sigeCode: string

  @Column({ type: 'varchar' })
    permission: string

  @Column({ type: 'varchar' })
    createdAt: string

  constructor () {
    if (!this.id) this.id = crypto.randomUUID()
    if (!this.createdAt) this.createdAt = new Date().toISOString()
  }
}
