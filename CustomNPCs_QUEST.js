function attack(event){
	var player = event.player;
	var world = player.getWorld();
	var itemName = "variedcommodities:orb"
	var itemDamage = 5;
	var itemFull = itemName + ":" + itemDamage;
	var item = world.createItem(itemName, itemDamage, 1);
	item.setCustomName("Power Orb");
	var itemCount =  player.inventoryItemCount(item);
	if(itemCount == 1){
		var nbt = player.getEntityNbt();
		var atkDmg = "generic.attackDamage";
		var ls = nbt.getList("Attributes", 10);
		var atkNbt = ls[8];
		atkNbt.setDouble("Base", 5.0);
	}
}