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
        { name: "Andy", bio: "Nerd", employedSince: "2018" },
        { name: "Jake", bio: "Super nerd", employedSince: "2016" },
      ],
    })).toEqual(`
# Employee directory

This is a very big company and we have many employees. Wow, pretty amazing.
Anyway, here they are:


## Andy

_2018_

Nerd

## Jake

_2016_

Super nerd`)
  });
});
