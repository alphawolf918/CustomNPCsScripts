function kill(event){
	var world = event.npc.getWorld();
	var ent = event.entity;
	var entityName = ent.getName();
	entityName = (entityName != "") ? entityName : "bad guy.";
	world.broadcast("Dialos has killed a " + entityName);
}