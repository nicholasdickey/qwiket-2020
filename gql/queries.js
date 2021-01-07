import { gql } from "apollo-boost";
export const QWIKET_QUERY = gql`
    query qwiketQuery(
        $search: String!
        $silo: Int
        $page: Int
        $size: Int
        $qid: Int
        $sortBy: String
        $environment: Int
    ) {
        qwiketQuery(
            search: $search
            silo: $silo
            page: $page
            size: $size
            qid: $qid
            sortBy: $sortBy
            environment: $environment
        ) {
            qid
            total
            qwikets {
                slug
                title
                description
                author
                site_name
                body
                image
                tags
                type
                reshare
                published_time
                shared_time
                authorAvatar
                subscr_status
                threadTagImage
                threadPublished_time
                userRole
                threadDescription
                threadTag
                threadImage
                threadAuthor
                threadSlug
                threadTitle
                threadTagName
                threadUrl
                children_summary
                parent_summary
                url
            }
        }
    }
`;
