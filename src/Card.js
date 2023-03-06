import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import OfferTile from "./OfferTile.js";

const MARK_VISITED = gql` mutation MarkVisited($offerId: String!) {
markVisited(offerId: $offerId) { id visitedCount } } `;



const GET_OFFERS = gql`
  query GetOffers($limit: Int, $sort: Sort) {
    offers(limit: $limit, sort: $sort) {
      id
      name
      imageUrl
      dateAdded
      description
      value
      currency
      visitedCount
    }
  }
`;

export default function OfferListing() {
    const { loading, error, data } = useQuery(GET_OFFERS, {
        variables: { limit: 10, sort: { by: "DATE_ADDED", order: "DESC" } },
    });

    const [markVisited] = useMutation(MARK_VISITED);

    const handleClick = (id) => {
        console.log(id, 'id')
        markVisited({
            variables: {
                offerId: id
            },
        })
    }

    if (loading) return <p>Loading offers...</p>;
    if (error) return <p>Failed to load offers</p>;

    return data.offers.map((offer) => (
        <OfferTile key={offer.id} name={offer.name} visitedCount={offer.visitedCount}
            price={offer.value + " " + offer.currency} imageUrl={offer.imageUrl} description={offer.description} clickHandler={() => handleClick(offer.id)} />
    ));
}