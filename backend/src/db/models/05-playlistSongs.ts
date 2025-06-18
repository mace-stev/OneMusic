import { ArrayDataType, Association, CreationOptional, DataTypes, Model, Optional } from 'sequelize';

const { Validator } = require('sequelize');

type PlaylistSongAttributes = {
    id: number,
    playlistId: number,
    songId: number
};

type PlaylistSongCreationAttributes = Optional<
    PlaylistSongAttributes, 'id'>;

module.exports = (sequelize: any, DataTypes: any) => {

    class PlaylistSong extends Model<PlaylistSongAttributes, PlaylistSongCreationAttributes> {
        declare id: CreationOptional<number>;
        declare playlistId: number;
        declare songId: number;




        async getSafePlaylistSong() {
            const safePlaylistSong = {
                id: this.id,
                playlistId: this.playlistId,
                songId: this.songId,


            };
            return safePlaylistSong
        }

        static associate(models: any) {
            // Associations go here

        }
        // declare public static associations: { [key: string]: Association<Model<any, any>, Model<any, any>>; };

    }
    PlaylistSong.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            playlistId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                }
            },
            songId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                }
            }


        },
        {
            sequelize,
            modelName: "PlaylistSong",
            defaultScope: {
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
        }
    )
    return PlaylistSong;
}
