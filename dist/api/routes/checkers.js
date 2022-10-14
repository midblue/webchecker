"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fancy_1 = require("../../db/fancy");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    res.send(await (0, fancy_1.getAllCheckers)());
});
router.get('/add', async (req, res) => {
    res.send(/* html */ `
    <form action="/api/checkers/add" method="post">
      <input type="text" name="url" placeholder="Url" />
      <input type="text" name="mainElement" placeholder="Main Element Selector" />
      <input type="text" name="qualifyingSelector" placeholder="Qualifying Selector" />
      <input type="text" name="compareSelector" placeholder="Compare Selector" />
      <input type="text" name="onChangeOutputSelectorsContent" placeholder="On Change, Output Selectors Content (comma separated)" />
      <input type="text" name="watchers" placeholder="Watchers (comma separated)" />
      <button type="submit">Add</button>
    </form>
    `);
});
router.post('/add', async (req, res) => {
    const url = req.query.url;
    const mainElement = req.query.mainElement;
    const qualifyingSelector = req.query
        .qualifyingSelector;
    const compareSelector = req.query
        .compareSelector;
    const onChangeOutputSelectorsContent = req.query.onChangeOutputSelectorsContent
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s) || [];
    const watchers = req.query.watchers
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s) || [];
    if (!watchers?.length) {
        res.status(400).send('No watchers');
        return;
    }
    if (!url || !mainElement || !compareSelector) {
        res.status(400).send('Missing url or selector');
        return;
    }
    if (!onChangeOutputSelectorsContent?.length) {
        res
            .status(400)
            .send('No onChangeOutputSelectorsContent');
        return;
    }
    await (0, fancy_1.addOrUpdateChecker)({
        url,
        mainElement,
        qualifyingSelector,
        compareSelector,
        onChangeOutputSelectorsContent,
        lastChecked: 0,
        lastValue: null,
        watchers,
    });
    res.send('OK');
});
router.get('/:url', async (req, res) => {
    const url = decodeURIComponent(req.params.url);
    res.send((await (0, fancy_1.getChecker)(url))?.lastOutput);
});
router.get('/remove/:url', async (req, res) => {
    const url = decodeURIComponent(req.params.url);
    (0, fancy_1.removeChecker)(url);
});
exports.default = router;
//# sourceMappingURL=checkers.js.map