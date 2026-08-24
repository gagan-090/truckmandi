import { render, screen, within } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { VehicleCard } from "@/components/marketplace/vehicle-card";
import { mockVehicles } from "@/data/mock-vehicles";
import { toVehicleSummary } from "@/features/vehicles/utils";
import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import { scopedKey } from "@/lib/storage/account-scope";
import { testUser } from "../test-utils";

const vehicle = toVehicleSummary(mockVehicles.find((v) => v.id === "tm10241")!);

describe("VehicleCard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the title as a link to the listing", () => {
    render(<VehicleCard vehicle={vehicle} />);

    const link = screen.getByRole("link", { name: vehicle.title });
    expect(link).toHaveAttribute("href", `/vehicles/${vehicle.slug}`);
  });

  it("shows the price in the compact Indian form", () => {
    render(<VehicleCard vehicle={vehicle} />);
    expect(screen.getByText("₹9.85 Lakh")).toBeInTheDocument();
  });

  it("shows the previous price and the discount when the seller has cut it", () => {
    render(<VehicleCard vehicle={vehicle} />);

    expect(screen.getByText("₹10.5 Lakh")).toBeInTheDocument();
    expect(screen.getByText("6% off")).toBeInTheDocument();
  });

  it("omits the strike-through when there is no price drop", () => {
    render(<VehicleCard vehicle={{ ...vehicle, previousPrice: undefined }} />);
    expect(screen.queryByText(/% off/)).not.toBeInTheDocument();
  });

  it("marks verified listings", () => {
    render(<VehicleCard vehicle={vehicle} />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("does not mark an unverified listing", () => {
    render(
      <VehicleCard
        vehicle={{
          ...vehicle,
          verification: { ...vehicle.verification, isVerified: false },
        }}
      />,
    );
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });

  it("shows key specs and the location", () => {
    render(<VehicleCard vehicle={vehicle} />);

    expect(
      screen.getByText(String(vehicle.manufacturingYear)),
    ).toBeInTheDocument();
    expect(screen.getByText("85k km")).toBeInTheDocument();
    expect(screen.getByText("Diesel")).toBeInTheDocument();
    expect(screen.getByText(vehicle.location.city)).toBeInTheDocument();
  });

  it("renders the listing photo with descriptive alt text", () => {
    render(<VehicleCard vehicle={vehicle} />);

    const image = screen.getByRole("img", {
      name: /front three-quarter view/i,
    });
    expect(image).toHaveAttribute("src", vehicle.images[0].url);
  });

  it("labels a sold listing", () => {
    render(<VehicleCard vehicle={{ ...vehicle, status: "sold" }} />);
    expect(screen.getByText("Sold")).toBeInTheDocument();
  });

  it("saves and unsaves without navigating", async () => {
    const user = userEvent.setup();
    render(<VehicleCard vehicle={vehicle} />);

    const save = screen.getByRole("button", {
      name: `Save ${vehicle.title}`,
    });
    expect(save).toHaveAttribute("aria-pressed", "false");

    await user.click(save);

    const saved = screen.getByRole("button", {
      name: `Remove ${vehicle.title} from saved`,
    });
    expect(saved).toHaveAttribute("aria-pressed", "true");
    expect(
      JSON.parse(
        window.localStorage.getItem(
          scopedKey(LOCAL_STORAGE_KEYS.favorites, testUser.id),
        ) ?? "[]",
      ),
    ).toEqual([vehicle.id]);

    await user.click(saved);
    expect(
      JSON.parse(
        window.localStorage.getItem(
          scopedKey(LOCAL_STORAGE_KEYS.favorites, testUser.id),
        ) ?? "[]",
      ),
    ).toEqual([]);
  });

  it("adds to comparison from the card", async () => {
    const user = userEvent.setup();
    render(<VehicleCard vehicle={vehicle} />);

    await user.click(
      screen.getByRole("button", {
        name: `Add ${vehicle.title} to comparison`,
      }),
    );

    expect(
      JSON.parse(
        window.localStorage.getItem(
          scopedKey(LOCAL_STORAGE_KEYS.compare, testUser.id),
        ) ?? "[]",
      ),
    ).toEqual([vehicle.id]);
  });

  it("hides the compare control on the compact variant", () => {
    render(<VehicleCard vehicle={vehicle} variant="compact" />);

    expect(
      screen.queryByRole("button", { name: /to comparison/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: `Save ${vehicle.title}` }),
    ).toBeInTheDocument();
  });

  it("adds seller context on the horizontal variant", () => {
    render(<VehicleCard vehicle={vehicle} variant="horizontal" />);

    const article = screen.getByRole("article");
    expect(within(article).getByText(/Listed by/)).toBeInTheDocument();
  });

  it("eager-loads only when marked as priority", () => {
    const { rerender } = render(<VehicleCard vehicle={vehicle} />);
    expect(
      screen.getByRole("img", { name: /front three-quarter/i }),
    ).toHaveAttribute("loading", "lazy");

    rerender(<VehicleCard vehicle={vehicle} priority />);
    expect(
      screen.getByRole("img", { name: /front three-quarter/i }),
    ).not.toHaveAttribute("loading", "lazy");
  });

  it("keeps one account's saved vehicles out of another account's list", async () => {
    const user = userEvent.setup();
    const other = { ...testUser, id: "usr_other_9999", name: "Other Buyer" };

    const first = render(<VehicleCard vehicle={vehicle} />);
    await user.click(screen.getByRole("button", { name: `Save ${vehicle.title}` }));

    expect(
      JSON.parse(
        window.localStorage.getItem(
          scopedKey(LOCAL_STORAGE_KEYS.favorites, testUser.id),
        ) ?? "[]",
      ),
    ).toEqual([vehicle.id]);
    first.unmount();

    // A different account on the same browser must start from nothing.
    render(<VehicleCard vehicle={vehicle} />, { user: other });

    expect(
      screen.getByRole("button", { name: `Save ${vehicle.title}` }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      window.localStorage.getItem(
        scopedKey(LOCAL_STORAGE_KEYS.favorites, other.id),
      ),
    ).toBeNull();
  });

  it("keeps signed-out saves in a guest bucket, not an account's", async () => {
    const user = userEvent.setup();
    render(<VehicleCard vehicle={vehicle} />, { user: null });

    await user.click(screen.getByRole("button", { name: `Save ${vehicle.title}` }));

    expect(
      JSON.parse(
        window.localStorage.getItem(
          scopedKey(LOCAL_STORAGE_KEYS.favorites, null),
        ) ?? "[]",
      ),
    ).toEqual([vehicle.id]);
    expect(
      window.localStorage.getItem(
        scopedKey(LOCAL_STORAGE_KEYS.favorites, testUser.id),
      ),
    ).toBeNull();
  });
});
