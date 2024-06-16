import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public reqQuery: Record<string, unknown>

    constructor(modelQuery: Query<T[], T>, reqQuery: Record<string, unknown>) {
        this.modelQuery = modelQuery
        this.reqQuery = reqQuery
    }

    search(searchableFields: string[]) {
        /* searchTerm -> /rooms?searchTerm=conference&floorNo=3
        reqQuery: { searchTerm:"conference", floorNo:3 }

        running search key *conference* on name:String, floorNo:Number fields.
        floorNo: "conferecne" !!! floorNo only accepts numbers
        */
        const searchTerm = this?.reqQuery?.searchTerm as string
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(
                    (field) =>
                        ({
                            [field]: { $regex: searchTerm, $options: 'i' },
                        } as FilterQuery<T>)
                ),
            })
        }
        return this
    }

    filter() {
        const exlcudeFields: string[] = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
        ]
        const filterQueries = { ...this.reqQuery }
        exlcudeFields.forEach((fields) => delete filterQueries[fields])
        this.modelQuery = this.modelQuery.find(filterQueries as FilterQuery<T>)

        return this
    }

    sort() {
        const sort: string =
            (this.reqQuery?.sort as string)?.split(',').join(' ') || 'roomNo'
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }
    paginate() {
        const limit: number = Number(this.reqQuery?.limit) || 5
        const page: number = Number(this.reqQuery?.page) || 1
        const skip = page && limit ? (page - 1) * limit : 0
        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this
    }
    fields() {
        const fields =
            (this.reqQuery?.fields as string)?.split(',').join(' ') || '-__v'
        this.modelQuery = this.modelQuery.select(fields)
        return this
    }
}

export default QueryBuilder