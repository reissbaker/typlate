import { expect, it, describe } from "vitest";
import userPartial from "../generated/user-partial.md";
import userList from "../generated/user-list.md";

describe("compiling", () => {
  it("generates the template", () => {
    expect(userPartial({
      name: "Test",
      bio: "A bio",
      employedSince: "2023",
    })).toEqual(`
## Test

_2023_

A bio`)
  });
});

describe("compiling with partials", () => {
  it("generates the filled out template", () => {
    expect(userList({
      users: [
        { name: "Jake", bio: "Nerd", employedSince: "2016" },
        { name: "Andy", bio: "Super nerd", employedSince: "2017" },
        { name: "Yuriy", bio: "Mega nerd", employedSince: "2018" },
      ],
    })).toEqual(`
# Employee directory

This is a very big company and we have many employees. Wow, pretty amazing.
Anyway, here they are:


## Jake

_2016_

Nerd

## Andy

_2017_

Super nerd

## Yuriy

_2018_

Mega nerd`)
  });
});
