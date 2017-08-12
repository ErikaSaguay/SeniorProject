module.exports = function(sequelize, DataTypes) {
    
	return sequelize.define("Customer", {
		customerId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
                firstName: DataTypes.STRING(25),
                lastName: DataTypes.STRING(25),
		username: DataTypes.STRING(15),
		password: DataTypes.STRING(15)
	});
}