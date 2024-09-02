import mongoose, { FilterQuery, Query } from "mongoose"
import { TMeta } from "../utils/sendResponse"

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public reqQuery: Record<string, unknown>
    private page: number
    private limit: number
    private skip: number
    private totalDocuments: number = 0
    private totalPages: number
    private sortQuery: string
    private fieldsQuery: string

    constructor(modelQuery: Query<T[], T>, reqQuery: Record<string, unknown>) {
        this.modelQuery = modelQuery
        this.reqQuery = reqQuery
        this.page = Number(this.reqQuery?.page) || 1
        this.sortQuery =
            (this.reqQuery?.sort as string)?.split(",").join(" ") || "name"
        this.fieldsQuery =
            (this.reqQuery?.fields as string)?.split(",").join(" ") || "-__v"
        this.limit =
            Number(
                this.reqQuery?.limit === "all" ? "0" : this.reqQuery?.limit
            ) || 5

        this.skip = this.page && this.limit ? (this.page - 1) * this.limit : 0
        this.totalPages =
            (this.limit > 0 && Math.ceil(this.totalDocuments / this.limit)) || 1
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.reqQuery?.searchTerm as string
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(
                    (field) =>
                        ({
                            [field]: { $regex: searchTerm, $options: "i" },
                        } as FilterQuery<T>)
                ),
            })
        }
        return this
    }

    filter() {
        const exlcudeFields: string[] = [
            "searchTerm",
            "sort",
            "limit",
            "page",
            "fields",
            "priceMax",
            "priceMin",
            "minCapacity",
            "groupBy",
            "maxCapacity",
        ]
        const filterQueries = { ...this.reqQuery }
        if (filterQueries?.priceMin && filterQueries?.priceMax) {
            this.modelQuery = this.modelQuery.find({
                pricePerSlot: {
                    $lte: Number(filterQueries?.priceMax),
                    $gte: Number(filterQueries?.priceMin),
                },
            })
        }
        if (filterQueries?.maxCapacity && filterQueries?.minCapacity) {
            this.modelQuery = this.modelQuery.find({
                capacity: {
                    $lte: Number(filterQueries?.maxCapacity),
                    $gte: Number(filterQueries?.minCapacity),
                },
            })
        }
        exlcudeFields.forEach((fields) => delete filterQueries[fields])

        this.modelQuery = this.modelQuery.find(filterQueries as FilterQuery<T>)
        return this
    }

    sort() {
        this.modelQuery = this.modelQuery.sort(this.sortQuery)
        return this
    }

    paginate() {
        if (this.limit && this.page) {
            this.modelQuery = this.modelQuery.skip(this.skip).limit(this.limit)
        }
        return this
    }

    fields() {
        this.modelQuery = this.modelQuery.select(this.fieldsQuery)
        return this
    }

    async countDocuments() {
        const filterQuery = this.modelQuery.getFilter()
        this.totalDocuments = await this.modelQuery.model.countDocuments(
            filterQuery
        )
        return {
            totalDocuments: this.totalDocuments,
            limit: this.limit,
            page: this.page,
            totalPages: this.totalPages,
        }
    }

    async groupData() {
        /**
         *  @description A method to group slots by same room and same booking date
         * @deprecated Only works on the `Slot` model
         */
        if (
            this.modelQuery.model.modelName === "slot" &&
            this.reqQuery?.groupBy &&
            this.reqQuery?.groupBy === "rooms"
        ) {
            const pipeline: any = [
                {
                    $group: {
                        _id: { room: "$room", date: "$date" },
                        slots: { $push: "$$ROOT" },
                    },
                },
                {
                    $lookup: {
                        from: "rooms",
                        foreignField: "_id",
                        localField: "_id.room",
                        as: "room",
                    },
                },
                {
                    $project: {
                        date: "$_id.date",
                        slots: 1,
                        room: { $arrayElemAt: ["$room", 0] },
                        _id: 0,
                    },
                },
                {
                    $facet: {
                        meta: [{ $count: "total" }],
                        data: [],
                    },
                },
                {
                    $addFields: {
                        meta: {
                            $ifNull: [{ $arrayElemAt: ["$meta.total", 0] }, 0],
                        },
                    },
                },
            ]

            if (this.reqQuery.room !== undefined) {
                console.log("Hitting room")
                pipeline.unshift({
                    $match: {
                        room: new mongoose.Types.ObjectId(
                            `${this.reqQuery.room}`
                        ),
                        isBooked: this.reqQuery.isBooked === "true",
                    },
                })
            }

            console.log(pipeline)

            let result = await this.modelQuery.model
                .aggregate(pipeline)
                .sort(this.sortQuery)
                .skip(this.skip)
                .limit(this.limit)

            // result = await result.fi
            this.totalDocuments = Number(result[0]?.meta) || 0

            const meta: TMeta = {
                totalDocuments: this.totalDocuments,
                totalPages: this.totalPages,
                limit: this.limit,
                page: this.page,
            }
            const data: any[] = result[0]?.data || []

            return { meta, data }
        } else {
            const meta: TMeta = {
                totalDocuments: this.totalDocuments,
                totalPages: this.totalPages,
                limit: this.limit,
                page: this.page,
            }

            return { meta, data: [] }
        }
    }
}

export default QueryBuilder
