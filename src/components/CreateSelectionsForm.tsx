"use client";
import { FormEvent, KeyboardEventHandler, useEffect } from "react";
import { socket } from "../../src/socket";

export default function CreateSelectionsForm() {
  const handleSelectionConfirmation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const firstSelection = formData.get("first_selection")?.toString();
    const secondSelection = formData.get("second_selection")?.toString();
    const thirdSelection = formData.get("third_selection")?.toString();

    const selections: string[] = [];

    if (firstSelection) selections.push(firstSelection);
    if (secondSelection) selections.push(secondSelection);
    if (thirdSelection) selections.push(thirdSelection);

    if (selections.length > 0) {
      socket.emit("confirm-selections", selections);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const initAutocomplete = () => {
    ["first_selection", "second_selection", "third_selection"].forEach((id) => {
      const input = document.getElementById(id) as HTMLInputElement;

      if (!input) return;

      const options = {
        types: ["restaurant"],
        fields: ["place_id", "geometry", "name"],
      };

      const placeAutocomplete = new google.maps.places.Autocomplete(
        input,
        options
      );

      placeAutocomplete.addListener("place_changed", () => {
        const place = placeAutocomplete.getPlace();

        if (place.name) input.value = place.name;
      });
    });
  };

  useEffect(() => {
    const scriptId = "google-maps-javascript-api";
    let googleMapsJavaScriptAPIScript = document.getElementById(scriptId);

    if (!googleMapsJavaScriptAPIScript) {
      const loadPlacesLibraryScript = document.createElement("script");
      loadPlacesLibraryScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GMP_API_KEY}&loading=async&libraries=places&callback=initAutocomplete`;
      loadPlacesLibraryScript.id = scriptId;
      loadPlacesLibraryScript.async = true;
      loadPlacesLibraryScript.defer = true;
      document.body.appendChild(loadPlacesLibraryScript);
    } else if (window.google && window.google.maps) {
      initAutocomplete();
    }

    window.initAutocomplete = initAutocomplete;

    return () => {
      window.initAutocomplete = undefined;
    };
  }, []);

  return (
    <form
      onSubmit={handleSelectionConfirmation}
      onKeyDown={handleKeyDown}
      className="flex flex-col w-80 sm:w-96 px-1 gap-2 mt-4"
    >
      <h2 className="text-lg sm:text-3xl text-center mt-4">Selection Phase</h2>
      <h3 className="text-center sm:text-2xl -mt-2">
        Enter up to three choices
      </h3>
      <input
        className="sm:text-xl mb-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="First Selection"
        type="text"
        name="first_selection"
        id="first_selection"
      />
      <input
        className="sm:text-xl mb-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Second Selection"
        type="text"
        name="second_selection"
        id="second_selection"
      />
      <input
        className="sm:text-xl mb-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Third Selection"
        type="text"
        name="third_selection"
        id="third_selection"
      />
      <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border sm:text-2xl border-gray-400 mt-2 rounded shadow">
        Confirm Selections
      </button>
    </form>
  );
}
