var assert = require("assert");
var fs = require("fs");
var vm = require("vm");

var database = fs.readFileSync("./src/database.js");
vm.runInThisContext(database);

describe("Database manipulation", () => {
    describe("#urlMatch", () => {
        it("should return false when url is not an exact match", () => {
            assert.equal(urlMatch("https://my.website.com", "my.website.com"), false);
        });
        it("should return false for no match", () => {
            assert.equal(urlMatch("https://my.website.com", "https://his.blog.io"), false);
        });
        it("should return true for exact match", () => {
            assert.equal(urlMatch("https://my.website.com", "https://my.website.com"), true);
        });
        it("should return true for match with wildcases", () => {
            assert.equal(urlMatch("https://my.website.com", "*my.website.com*"));
        });
    });

    describe("#hasKeys", () => {
        it("should return false for empty object", () => {
            assert.equal(hasKeys({}, ["one", "two"]));
        });
        it("should return false when object does not have at least one of required keys", () => {
            assert.equal(hasKeys({
                one: "I am here"
            }, ["one", "two"]));
        });
        it("should return true for for object with exact keys", () => {
            assert.equal(hasKeys({
                one: 1,
                two: 2
            }, ["one", "two"]));
        });
        it("should return true for object with more than required keys", () => {
            assert.equal(hasKeys({
                one: 1,
                two: 2,
                three: 3
            }, ["one", "two"]));
        });
        it("should throw an exception when list of keys is not a list", () => {
            assert.throws(() => {
                hasKeys({
                    one: 1,
                    two: 2
                }, "one");
            }, TypeError);
        });
    });

    describe("#isBrowserUrl", () => {
        it("should return false for non-internal url", () => {
            assert.equal(isBrowserUrl("https://my.website.com"), false);
        });
        it("should return true for internal url", () => {
            assert.equal(isBrowserUrl("chrome://about"), true);
        });
        it("should return true for another internal url", () => {
            assert.equal(isBrowserUrl("about:about"), true);
        });
        it("should return false for invalid url", () => {
            assert.equal(isBrowserUrl("This is not a website"), false);
        });
        it("should throw an exception when url is not a string", () => {
            assert.throws(() => {
                isBrowserUrl(["my.website.com"])
            }, TypeError);
        });
    });
});