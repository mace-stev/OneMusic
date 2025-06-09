import { Association, CreationOptional, DataTypes, Model, Optional } from 'sequelize';

const { Validator } = require('sequelize');

type PlaylistAttributes = {
    id: number,
    name: string,
    ownerId: number,
    previewId: number,
};

type PlaylistCreationAttributes = Optional<
    PlaylistAttributes, 'id' | "previewId">;

module.exports = (sequelize: any, DataTypes: any) => {

    class Playlist extends Model<PlaylistAttributes, PlaylistCreationAttributes> {
        declare id: CreationOptional<number>;
        declare name: string;
        declare ownerId: number;
        declare previewId: number;



        async getSafePlaylist() {
            const safePlaylist = {
                id: this.id,
                name: this.name,
                ownerId: this.ownerId,
                previewId: this.previewId

            };
            return safePlaylist
        }

        static associate(models: any) {
            // Associations go here
            Playlist.belongsTo(models.Image, {
                foreignKey: "previewId",
                onDelete: "SET NULL"
            })
            Playlist.belongsTo(models.User, {
                foreignKey: "ownerId",
                onDelete: "CASCADE"
            })
            Playlist.belongsToMany(models.Song, {
                through: models.PlaylistSong,
                foreignKey: 'playlistId',
                otherKey: 'songId',
            });
        }
        // declare public static associations: { [key: string]: Association<Model<any, any>, Model<any, any>>; };

    }
    Playlist.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isGoodLength(value: string) {
                        if (value.length < 1 || value.length > 45) {
                            throw new Error('Playlist name must be between 1 - 45 characters');
                        }
                    },
                }
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                }
            },
            previewId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {


                }
            },

        },
        {
            sequelize,
            modelName: "Playlist",
            defaultScope: {
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
        }
    )
    return Playlist;
}
