// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Proposal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Proposal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Proposal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Proposal", id.toString(), this);
    }
  }

  static load(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get("Proposal", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get time(): BigInt {
    let value = this.get("time");
    return value!.toBigInt();
  }

  set time(value: BigInt) {
    this.set("time", Value.fromBigInt(value));
  }

  get data(): string {
    let value = this.get("data");
    return value!.toString();
  }

  set data(value: string) {
    this.set("data", Value.fromString(value));
  }

  get result(): string {
    let value = this.get("result");
    return value!.toString();
  }

  set result(value: string) {
    this.set("result", Value.fromString(value));
  }

  get deployment(): string {
    let value = this.get("deployment");
    return value!.toString();
  }

  set deployment(value: string) {
    this.set("deployment", Value.fromString(value));
  }
}

export class Deployment extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Deployment entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Deployment must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Deployment", id.toString(), this);
    }
  }

  static load(id: string): Deployment | null {
    return changetype<Deployment | null>(store.get("Deployment", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get dao(): string {
    let value = this.get("dao");
    return value!.toString();
  }

  set dao(value: string) {
    this.set("dao", Value.fromString(value));
  }

  get state(): string {
    let value = this.get("state");
    return value!.toString();
  }

  set state(value: string) {
    this.set("state", Value.fromString(value));
  }

  get timeCreated(): BigInt {
    let value = this.get("timeCreated");
    return value!.toBigInt();
  }

  set timeCreated(value: BigInt) {
    this.set("timeCreated", Value.fromBigInt(value));
  }

  get proposals(): Array<string> | null {
    let value = this.get("proposals");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set proposals(value: Array<string> | null) {
    if (!value) {
      this.unset("proposals");
    } else {
      this.set("proposals", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class Dao extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Dao entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Dao must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Dao", id.toString(), this);
    }
  }

  static load(id: string): Dao | null {
    return changetype<Dao | null>(store.get("Dao", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get isValidated(): boolean {
    let value = this.get("isValidated");
    return value!.toBoolean();
  }

  set isValidated(value: boolean) {
    this.set("isValidated", Value.fromBoolean(value));
  }

  get fronts(): Array<string> | null {
    let value = this.get("fronts");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set fronts(value: Array<string> | null) {
    if (!value) {
      this.unset("fronts");
    } else {
      this.set("fronts", Value.fromStringArray(<Array<string>>value));
    }
  }
}
