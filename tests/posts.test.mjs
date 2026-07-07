import test from "node:test";
import assert from "node:assert/strict";
import { getAllPosts, getPost } from "../lib/posts.js";

test("getAllPosts returns hello-world with full frontmatter", () => {
  const posts = getAllPosts();
  assert.ok(posts.length >= 1);
  const hw = posts.find((p) => p.slug === "hello-world");
  assert.ok(hw, "hello-world post missing");
  assert.equal(hw.title, "Hello, world");
  assert.equal(hw.date, "2025-08-30");
  assert.ok(hw.description.length > 10);
  assert.ok(hw.content.includes("resilient cloud platforms"));
});

test("posts are sorted newest first", () => {
  const dates = getAllPosts().map((p) => p.date);
  const sorted = [...dates].sort().reverse();
  assert.deepEqual(dates, sorted);
});

test("getPost returns null for unknown slug", () => {
  assert.equal(getPost("does-not-exist"), null);
});
