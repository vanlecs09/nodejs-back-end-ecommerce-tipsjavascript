const { inventory } = require("../inventory.model")

const insertInventory = async ({productId, shopId, stock, location = 'unknow'}) => {
    return await inventory.create({
        inven_productId : productId,
        inven_shop_id : shopId,
        inven_location : location,
        inven_stock : stock
    })
}

module.exports = {
    insertInventory
}