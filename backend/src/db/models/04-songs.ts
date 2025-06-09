import { ArrayDataType, Association, CreationOptional, DataTypes, Model, Optional } from 'sequelize';

const { Validator } = require('sequelize');

type SongAttributes = {
    id: number,
    title: string,
    artist: string,
    playlistIds: number,
    previewId: number,
};

type SongCreationAttributes = Optional<
    SongAttributes, 'id' | "previewId">;

module.exports = (sequelize: any, DataTypes: any) => {

    class Song extends Model<SongAttributes, SongCreationAttributes> {
        declare id: CreationOptional<number>;
        declare title: string;
        declare artist: string;
        declare playlistId: number;
        declare previewId: number | null;



        async getSafeSong() {
            const safeSong = {
                id: this.id,
                title: this.title,
                artist: this.artist,
                playlistId: this.playlistId,
                previewId: this.previewId

            };
            return safeSong
        }

        static associate(models: any) {
            // Associations go here
            Song.belongsTo(models.Image, {
                foreignKey: "previewId",
                onDelete: "SET NULL"
            })
            Song.belongsToMany(models.Playlist, {
                through: models.PlaylistSong,          
                foreignKey: 'songId',
                otherKey: 'playlistId',
            });
        }
        // declare public static associations: { [key: string]: Association<Model<any, any>, Model<any, any>>; };

    }
    Song.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isGoodLength(value: string) {
                        if (value.length < 1 || value.length > 120) {
                            throw new Error('Song name must be between 1 - 120 characters');
                        }
                    },
                }
            },
            artist: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isGoodLength(value: string) {
                        if (value.length < 1 || value.length > 120) {
                            throw new Error('Artist name must be between 1 - 120 characters');
                        }
                    },
                }
            },
            playlistIds: {
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
            modelName: "Song",
            defaultScope: {
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
        }
    )
    return Song;
}
