import { Association, CreationOptional, DataTypes, Model, Optional } from 'sequelize';

const { Validator } = require('sequelize');

type ImageAttributes = {
    id: number,
    url: string
 
};

type ImageCreationAttributes = Optional<
    ImageAttributes, 'id'>;

module.exports = (sequelize: any, DataTypes: any) => {

    class Image extends Model<ImageAttributes, ImageCreationAttributes> {
        declare id: CreationOptional<number>;
        declare url: string;
     
     


        async getSafeImage() {
            const safeImage = {
                id: this.id,
                url: this.url
              
            };
            return safeImage
        }

        static associate(models: any) {
            // Associations go here
        }
        // declare public static associations: { [key: string]: Association<Model<any, any>, Model<any, any>>; };

    }
    Image.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    
                }
            },

            
        },
        {
            sequelize,
            modelName: "Image",
            defaultScope: {
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
        }
    )
    return Image;
}
