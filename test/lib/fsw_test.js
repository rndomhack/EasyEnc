"use strict";

var fs = require("fs");
var path = require("path");
var os = require("os");
var assert = require("assert");

var fsw = require("../../src/lib/fsw");

var tmpBase = "autoconvert_test";
var tmpExt = ".txt";
var tmpName = tmpBase + tmpExt;
var tmpPath = path.join(os.tmpdir(), tmpName);
var tmpDestPath = path.join(os.tmpdir(), "autoconvert_test_dest");
var tmpDest2Path = path.join(os.tmpdir(), "autoconvert_test_dest2");
var tmpContent = Math.random().toString(36).slice(2) + "あいうえお日本語";

describe("fsw", () => {

    describe("File", () => {

        before(() => {
            fs.writeFileSync(tmpPath, tmpContent);
        });

        after(() => {
            fs.unlinkSync(tmpPath);
        });

        it("should get path", () => {
            var file = new fsw.File(tmpPath);
            assert.deepEqual(file.path, tmpPath);
        });

        it("should get name", () => {
            var file = new fsw.File(tmpPath);
            assert.deepEqual(file.name, tmpName);
        });

        it("should get base", () => {
            var file = new fsw.File(tmpPath);
            assert.deepEqual(file.base, tmpBase);
        });

        it("should get ext", () => {
            var file = new fsw.File(tmpPath);
            assert.deepEqual(file.ext, tmpExt);
        });

        it("should get stats", done => {
            var file = new fsw.File(tmpPath);
            file.stat().then(() => {
                assert(true);
                done();
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should exist", done => {
            var file = new fsw.File(tmpPath);
            file.exists().then(() => {
                assert(true);
                done();
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should copy", done => {
            var file = new fsw.File(tmpPath);
            var destFile = new fsw.File(tmpDestPath);
            file.copy(destFile).then(() => {
                var txt = fs.readFileSync(destFile.path, "utf8");
                assert.deepEqual(txt, tmpContent);
                fs.unlinkSync(destFile.path);
                done();
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should move", done => {
            fs.writeFileSync(tmpDestPath, tmpContent);
            var file = new fsw.File(tmpDestPath);
            var destFile = new fsw.File(tmpDest2Path);
            file.move(destFile).then(() => {
                file.exists().then(() => {
                    assert(false);
                    done();
                }).catch(() => {
                    destFile.exists().then(() => {
                        var txt = fs.readFileSync(destFile.path, "utf8");
                        assert.deepEqual(txt, tmpContent);
                        fs.unlinkSync(destFile.path);
                        done();
                    }).catch(() => {
                        assert(false);
                        done();
                    });
                });
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should make", done => {
            var file = new fsw.File(tmpDestPath);
            file.make().then(() => {
                file.exists().then(() => {
                    assert(true);
                    fs.unlinkSync(file.path);
                    done();
                }).catch(() => {
                    assert(false);
                    done();
                });
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should remove", done => {
            var file = new fsw.File(tmpDestPath);
            file.make().then(file.remove()).then(() => {
                file.exists().then(() => {
                    assert(false);
                    fs.unlinkSync(file.path);
                    done();
                }).catch(() => {
                    assert(true);
                    done();
                });
            }).catch(() => {
                assert(false);
                fs.unlinkSync(file.path);
                done();
            });
        });

        it("should read", done => {
            var file = new fsw.File(tmpPath);
            file.read("utf8").then(data => {
                assert.deepEqual(data, tmpContent);
                done();
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should write", done => {
            var file = new fsw.File(tmpDestPath);
            file.write(tmpContent, "utf8").then(() => {
                var txt = fs.readFileSync(file.path, "utf8");
                assert.deepEqual(txt, tmpContent);
                fs.unlinkSync(file.path);
                done();
            }).catch(() => {
                assert(false);
                done();
            });
        });

        it("should write and read in SJIS", done => {
            var file = new fsw.File(tmpDestPath);
            file.write(tmpContent, "SJIS").then(() => {
                file.read("SJIS").then(data => {
                    assert.deepEqual(data, tmpContent);
                    fs.unlinkSync(file.path);
                    done();
                }).catch(() => {
                    assert(false, "read");
                    fs.unlinkSync(file.path);
                    done();
                });
            }).catch(() => {
                assert(false, "write");
                done();
            });
        });

        it("should get parent directory", () => {
            var file = new fsw.File(tmpPath);
            var parent = file.parent();
            assert(parent instanceof fsw.Folder, "instanceof fsw.Folder");
            var parentPath = parent.path;
            assert.deepEqual(parentPath, path.dirname(file.path), "path");
        });

    });

});
