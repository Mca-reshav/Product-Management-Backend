const { generateProdID } = require("../../services/common.service");
const {
  find,
  create,
  pagination,
  deleteOne,
  updateOne
} = require("../../services/mongo.service");
const { error, log } = require("../../services/response.service");
const { product, user } = require("../../utils/messages.utils");
const { roleType } = require("../../utils/constants.utils");

exports.add = async (req, res) => {
  try {
    const productId = generateProdID();
    const { name, brand } = req.body;
    const isExist = await find({
      model: "ProductECOM",
      query: { name: name, brand: brand },
      attributes: ["productId"],
    });
    if (isExist[0]?.productId)
      return res.json(log(false, product.ALREADY_EXIST));

    const insertNew = await create({
      model: "ProductECOM",
      data: {
        productId: productId,
        ...req.body,
        filename: req.file?.originalname ||'',
        contentType: req.file?.mimetype || '',
        imageBase64: req.file?.buffer || '',
        createdBy: req.user?.userId,
      },
    });
    if (!insertNew) return res.json(log(false, product.ADD_ERROR));
    return res.json(log(true, product.ADD_SUCCESS));
  } catch (err) {
    error(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const productId = req.params?.productId;
    const isExist = await find({
      model: "ProductECOM",
      query: {productId: productId},
      attributes: ["name"]
    });
    if (!isExist[0]?.name) return res.json(log(false, product.REMOVE_ERROR));

    const removeProduct = await deleteOne({
      model: "ProductECOM",
      query: { productId: productId}
    });
    if (removeProduct?.deletedCount == 1) return res.json(log(true, product.REMOVE_SUCCESS));
    return res.json(log(false, user.FAILED));
  } catch (err) {
    error(err)
  }
};

exports.edit = async (req, res) => {
  try {
    const productId = req.params?.productId;
    console.log(productId, req.body)
    const isExist = await find({
      model: "ProductECOM",
      query: {productId: productId},
      attributes: ["name"]
    });
    if (!isExist[0]?.name) return res.json(log(false, product.EDIT_ERROR));    
    const updateProduct = await updateOne({
      model: "ProductECOM",
      query: { productId: productId},
      data: {...req.body}
    });
    if (updateProduct) return res.json(log(true, product.EDIT_SUCCESS));
    return res.json(log(false, user.FAILED));
  } catch (err) {
    error(err)
  }
};

exports.listAll = async (req, res) => {
  try {
    const { searchText, page, limit,search, sortField, sortOrder } = req.query;
    const isAdmin = req.user.role == Object.keys(roleType)[0];
    let conditionalAttributes = ["productId", "brand", "name", "price", "rating", "description", "category", "imageBase64"];
    if (isAdmin) conditionalAttributes.push("createdBy", "createdAt", "stock");
    const getData = await pagination({
      model: "ProductECOM",
      query: isAdmin ? {} : { stock: { $gte: 1 } },
      attributes: conditionalAttributes,
      sort: [sortField],
      searchFields: ["brand", "name", "productId"],
      defaultSort: ["createdAt"],
      searchText: searchText || search || "",
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
      excludeAttribute: ["_id"],
    });
    if (!getData) return res.json(log(false, product.LIST_ALL_ERROR));
    return res.json(log(true, product.LIST_ALL_SUCCESS, getData));
  } catch (err) {
    error(err);
  }
};

exports.list = async (req, res) => {
  try {
    const isAdmin = req.user.role == Object.keys(roleType)[0];
    const productId = req.params?.productId;

    let conditionalAttributes = [
      "productId",
      "brand",
      "name",
      "description",
      "price",
      "rating",
      "imageBase64", 
    ];
    if (isAdmin) {
      conditionalAttributes.push(
        "stock",
        "createdBy",
        "createdAt",
        "updatedBy",
        "updatedAt"
      );
    }

    const getData = await find({
      model: "ProductECOM",
      query: productId ? { productId: productId } : {},
      attributes: conditionalAttributes,
    });

    if (!getData || getData.length === 0) {
      return res.json(log(false, product.LIST_ERROR));
    }

    const processedData = getData.map((item) => ({
      ...item,
      image:
        item.imageBase64 && typeof item.imageBase64 === "string"
          ? `http://localhost:3000/uploads/${item.imageBase64}`
          : item.imageBase64,
    }));

    return res.json(log(true, product.LIST_SUCCESS, processedData));
  } catch (err) {
    error(err);
  }
};