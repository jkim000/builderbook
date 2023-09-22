const _ = require('lodash');

const slugify = (text) => _.kebabCase(text);

const createUniqueSlug = async (Model, slug, count) => {
    const user = await Model.findOne({ slug: `${slug}-${count}` }, 'id');

    if (!user) return `${slug}-${count}`;
    else return createUniqueSlug(Model, slug, count + 1);
};

const generateSlug = async (Model, name, filter = {}) => {
    const origSlug = slugify(name);

    const user = await Model.findOne(Object.assign({ slug: origSlug }, filter), 'id');

    if (!user) return origSlug;

    return createUniqueSlug(Model, origSlug, 1);
};

module.exports = generateSlug;
// export default generateSlug;
