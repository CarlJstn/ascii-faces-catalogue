import React from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { DateTime } from "luxon";
import { AsciiFace, pixelSizeLabel } from "../models/AsciiFace";

type Data = {
  asciiFaces: AsciiFace[];
};

enum SortBy {
  dateAdded = "dateAdded",
  id = "id",
  price = "price",
}

const sortByLabel: { [key in SortBy]: string } = {
  dateAdded: "Date Added",
  id: "ID",
  price: "Price",
};

enum SortOrder {
  ascending = "ascending",
  descending = "descending",
}

const sortOrderLabel: { [key in SortOrder]: string } = {
  ascending: "Ascending",
  descending: "Descending",
};

const numberOfAsciiFacesPerFetch: number = 20;

@observer
export class HomePage extends React.Component {
  constructor(props: any) {
    super(props);
    makeObservable(this, {
      asciiFaces: observable,
      sortBy: observable,
      sortOrder: observable,
      asciiFacesLimit: observable,
      asciiFacesFetching: observable,
      asciiFacesReachedEnd: observable,
      ads: observable,
      currentAd: observable,
      updateAsciiFaces: action,
      updateSortBy: action,
      updateSortOrder: action,
      updateAsciiFacesLimit: action,
      updateAsciiFacesFetching: action,
      updateAds: action,
      updateCurrentAd: action,
      sortedAsciiFaces: computed,
    });
  }

  asciiFaces: AsciiFace[] | undefined;

  sortBy: SortBy = SortBy.dateAdded;

  sortOrder: SortOrder = SortOrder.descending;

  asciiFacesLimit: number = numberOfAsciiFacesPerFetch;

  asciiFacesFetching: boolean = false;

  asciiFacesReachedEnd: boolean = false;

  ads: string[] = [];

  currentAd: number = 1;

  updateAsciiFaces(asciiFaces: AsciiFace[]) {
    this.asciiFaces = asciiFaces;
  }

  updateSortBy(newValue: SortBy) {
    this.sortBy = newValue;
  }

  updateSortOrder(newValue: SortOrder) {
    this.sortOrder = newValue;
  }

  updateAsciiFacesLimit(newValue: number) {
    this.asciiFacesLimit = newValue;
  }

  updateAsciiFacesFetching(newValue: boolean) {
    this.asciiFacesFetching = newValue;
  }

  updateAsciiFacesReachedEnd(newValue: boolean) {
    this.asciiFacesReachedEnd = newValue;
  }

  updateAds(newValue: string) {
    this.ads.push(newValue);
  }

  updateCurrentAd(newValue: number) {
    this.currentAd = newValue;
  }

  get sortedAsciiFaces(): AsciiFace[] {
    const asciiFaces = this.asciiFaces;
    const sortBy = this.sortBy;
    const sortOrder = this.sortOrder;

    if (!asciiFaces) return [];

    const sortAsciiFacesByKey = (key: keyof AsciiFace) => {
      const sortedByKey = asciiFaces.slice().sort(function (a, b) {
        if (a[key] < b[key]) return 1;
        if (a[key] > b[key]) return -1;
        return 0;
      });
      if (sortOrder === SortOrder.ascending) return sortedByKey.reverse();
      return sortedByKey;
    };

    switch (sortBy) {
      case SortBy.dateAdded:
        return sortAsciiFacesByKey("dateAdded");
      case SortBy.id:
        return sortAsciiFacesByKey("id");
      case SortBy.price:
        return sortAsciiFacesByKey("priceInCents");
      default:
        return [];
    }
  }

  getDateTimeLabel(dateTime: string): string {
    const dateTimeLabelFormat = "EEE, d MMM yyyy, h:mm a";
    return DateTime.fromISO(dateTime).toFormat(dateTimeLabelFormat);
  }

  getFormattedAmount = (amount: number): string => {
    const float = parseFloat(`${amount}`);
    if (isNaN(float)) return "";

    const sign = float < 0 ? "-" : "";
    const abs = Math.abs(float);
    const formattedAmount = abs.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    return `${sign}$ ${formattedAmount}`;
  };

  trackScrolling = () => {
    const wrappedElement = document.getElementById("ascii-faces-wrapper");
    if (!wrappedElement) return false;
    if (this.isBottom(wrappedElement)) {
      this.updateAsciiFacesLimit(
        this.asciiFacesLimit + numberOfAsciiFacesPerFetch
      );
      this.fetchAsciiFaces();
      document.removeEventListener("scroll", this.trackScrolling);
    }
  };

  isBottom(element: Element) {
    return element.getBoundingClientRect().bottom <= window.innerHeight;
  }

  getAd() {
    let newAd: number = 0;
    const currentAd = this.currentAd;

    do {
      newAd = Math.floor(Math.random() * 8) + 1;
    } while (currentAd === newAd);

    this.updateAds(`/ads/ad-${newAd}.jpg`);
    this.updateCurrentAd(newAd);
  }

  fetchAsciiFaces() {
    const prevAsciiFacesLength = this.sortedAsciiFaces.length;

    // fetch asciiFaces
    fetch("asciiFaces.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Data) => {
        const asciiFaces = data.asciiFaces
          .reverse()
          .slice(0, this.asciiFacesLimit);

        this.updateAsciiFacesFetching(true);
        setTimeout(() => {
          if (prevAsciiFacesLength === asciiFaces.length)
            this.updateAsciiFacesReachedEnd(true);
          this.updateAsciiFacesFetching(false);
          this.updateAsciiFaces(asciiFaces);
          this.getAd();
          document.addEventListener("scroll", this.trackScrolling);
        }, Math.floor(Math.random() * 6) + 1000);
      });
  }

  componentDidMount() {
    this.fetchAsciiFaces();
    document.addEventListener("scroll", this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
  }

  render(): React.ReactNode {
    return (
      <div className="home-page">
        {this.renderSorter()}
        {this.renderAsciiFaces()}
      </div>
    );
  }

  renderSorter(): React.ReactNode {
    const optionsForSortBy = (
      Object.keys(SortBy) as Array<keyof typeof SortBy>
    ).map((key) => (
      <option key={key} value={key}>
        {sortByLabel[key]}
      </option>
    ));

    const optionsForSortOrder = (
      Object.keys(SortOrder) as Array<keyof typeof SortOrder>
    ).map((key) => (
      <option key={key} value={key}>
        {sortOrderLabel[key]}
      </option>
    ));

    return (
      <div className="sorter">
        <select
          value={this.sortBy}
          onChange={(value) => this.updateSortBy(value.target.value as SortBy)}
        >
          {optionsForSortBy}
        </select>
        <select
          value={this.sortOrder}
          onChange={(value) =>
            this.updateSortOrder(value.target.value as SortOrder)
          }
        >
          {optionsForSortOrder}
        </select>
      </div>
    );
  }

  renderAsciiFaces(): React.ReactNode {
    const asciiFaces = this.sortedAsciiFaces;
    const isLoading = this.asciiFacesFetching;
    const endReached = this.asciiFacesReachedEnd;

    let index: number = 0;
    let counter: number = 0;
    let temporary: AsciiFace[] = [];
    const asciiFacesElement = [];

    for (
      index = 0;
      index < asciiFaces.length;
      index += numberOfAsciiFacesPerFetch
    ) {
      temporary = asciiFaces.slice(index, index + numberOfAsciiFacesPerFetch);
      counter++;
      asciiFacesElement.push(
        this.renderAsciiFacesAndAd({ asciiFaces: temporary, index: counter })
      );
    }

    return (
      <div id="ascii-faces-wrapper">
        {asciiFacesElement}
        <div className="state">
          {endReached ? "~ end of catalogue ~" : isLoading ? "Loading..." : ""}
        </div>
      </div>
    );
  }

  renderAsciiFacesAndAd(args: {
    asciiFaces: AsciiFace[];
    index: number;
  }): React.ReactNode {
    const { asciiFaces, index } = args;

    return (
      <div className="ascii-faces-and-ad" key={index}>
        <div className="ascii-faces">
          {asciiFaces.map((asciiFace) => this.renderAsciiFace(asciiFace))}
        </div>
        <div className="ad-container">
          <div className="text">Advertisement:</div>
          <img
            className="ad"
            src={this.ads[index - 1]}
            alt="random advertisement"
          />
        </div>
      </div>
    );
  }

  renderAsciiFace(asciiFace: AsciiFace): React.ReactNode {
    return (
      <div className="ascii-face" key={asciiFace.id}>
        <div className={`face ${asciiFace.size}`}>{asciiFace.face}</div>
        <div className="price">
          {this.getFormattedAmount(asciiFace.priceInCents)}
        </div>
        <div className="id">ID: {asciiFace.id}</div>
        <div className="size">Size: {pixelSizeLabel[asciiFace.size]}</div>
        <div className="date-added">
          {this.getDateTimeLabel(asciiFace.dateAdded)}
        </div>
      </div>
    );
  }
}
