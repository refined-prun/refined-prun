# Prosperous Universe Game Concepts

## Overview

Prosperous Universe (PrUn) is a real-time, persistent MMO economic simulator. Players establish companies that extract resources, manufacture goods, trade on markets, build bases across planets, employ workers at different tiers, and coordinate through corporations and contracts. The game uses a single shared galaxy with four major factions controlling planets and currencies.

## Factions

| Code | Faction | Currency |
|----|---------|----------|
| AI | Antares Initiative | AIC |
| CI | Castillo-Ito Mercantile | CIS |
| NC | NEO Charter Exploration | NCC |
| IC | Insitor Cooperative | ICA |

There is also a non-playable faction called Exodus Council, with the ECD currency. The faction is not accessible in-game, but its currency shows up in the UI.

Faction-controlled planets default to their faction's currency.

## Materials

Materials are the physical goods that drive all economic activity: extracted, manufactured, consumed, traded, and shipped.

### Identification

- Each material has a unique 3-letter **ticker** (e.g., `FE`, `H2O`, `RAT`, `INS`).
- Tickers are always displayed in uppercase.

### Properties

- **Weight** - in tonnes (t)
- **Volume** - in m3

### Categories

Materials are grouped into several dozen categories. Category determines icon color in the UI and groups materials in some parts of the UI. Examples: ores, minerals, electronics, fuels, ship parts.

### Usage

- **Inputs/outputs** of production recipes.
- **Building construction** costs, includes: building prefabs, and extreme-environment materials.
- **Workforce consumables**: specific tickers required daily per workforce tier (e.g., DW, RAT for Pioneers).
- **Ship repair** materials (hull plates, structural components).
- **Planetary project upkeep** (e.g., CoGC requires DW, MCG, PE, RAT).

## Planets

Each planet has properties affecting base viability. Any extremes require special construction materials for structures:

- **Temperature**: INS for cold, TSH for hot.
- **Gravity**: MGC for low, BL for high.
- **Pressure**: SEA for low, HSE for high.
- **Type**: Rocky or gas giant. Rocky require MCG, gas giants require AEF.

Additionally, planets have properties affecting production:
- **Fertility**: Affects FRM/ORC efficiency. Range roughly -33% to +33%. Fully infertile planets cannot build farms.
- **Resources**: Extractable minerals, ores, liquids, gases. Different planetary conditions determine extraction building type (RIG for liquids, EXT for solids, COL for gases).

Each planet has a limited number of plots. To build a base, a planet must have at least one plot.

## Bases

A base is the primary operational unit on a planet.

- Bases can be built on any planet.
- Bases use up a base permit, and can be expanded to three permits.
- A single-permit base has 500 building area. Each other permit adds 250.
- Additional permits can be reclaimed at any time.
- The first building on a planet is always the Base Core Module.
- Without any storage buildings the base provides 1500m3/1500t of storage.

Base Demolition requires: base not HQ, only core module remains, storage empty, no expanded permits, non-base storage available for reclaimed materials. Returns core module materials and reclaims the spent permit.

## Headquarters (HQ)

Each company has one headquarters (HQ), can be relocated via the HQ command. Headquarters can be upgraded to unlock additional base permits (costs materials, increases with each upgrade).

## Workers & Workforce Tiers (5)

Every base has a population divided into workforce tiers. Workers consume specific commodities daily and require habitation buildings. Idle workers still consume consumables. Workforce tiers (ascending specialization): Pioneer, Settler, Technician, Engineer, Scientist.

## Buildings

Buildings are structures constructed within a base that provide workforce housing, production capacity, resource extraction, or extra storage space. Each type is identified by a short ticker (e.g., `FRM`, `EXT`, `SME`).

### Construction

- Requires construction materials: building prefabs and extreme-environment materials (where applicable).
- Environment materials are either required per-area (MCG, INS, SEA), or per-building (TSH, MGC, BL, HSE, AEF).
- Each building consumes **area** from the base's area pool.
- Demolishing a building reclaims its area and returns a portion of construction materials.

### Degradation & Repair

Buildings degrade over time (condition %), reducing production efficiency proportionally. Lowest condition floor: 33%.

- Degradation reaches 33% after ~90 days.
- Repair cost scales linearly with degradation.

## Production

### Production Lines

A production line is a set of identical buildings (e.g., 3 FRM = 1 production line). Each building in the line can process one order simultaneously.

### Production Orders
- Players queue orders in production lines via PRODCO command.
- Specify: primary output commodity, order size, input materials.
- Order size scales production time and material consumption proportionally.
- Maximum queue: 5 pending orders; active orders = building count in line.
- Efficiency multipliers applied based: building condition, worker availability, worker satisfaction, experts, CoGC programs, soil fertility.
- Production halts if: no workers, no consumables, no inputs, insufficient production fees, insufficient funds, not enough space for output.

### Efficiency Factors
1. **Building Condition**: Proportional to current condition %; floor is 33%.
2. **Worker Availability**: Efficiency multiplied by (workers present / workers required).
3. **Worker Satisfaction**: Depends on consumable availability. Full satisfaction (100%) if all essentials + some luxuries met. Partial fulfillment drops efficiency.
4. **Experts**: Fixed bonus multipliers per industry (see "Experts" section for limits).
5. **Soil Fertility**: ±33% for FRM/ORC only.
6. **CoGC Programs**: +25% for specific industries if running and upkeep paid.

### Production Fees
Planetary governors (via Local Rules) can impose production fees per industry/tier. Fees scale with order size, deducted when order placed. Collected by planetary government.

## Experts

Experts provide fixed bonus multipliers to production line efficiency in their industry. Spawn over time by running production buildings.

- First experts are included in starter package.
- Each finished production order earns progress towards next expert.
- Progress is based on 100% efficiency. Buildings with increased efficiency contribute more progress.
- Each industry can have up to 5 experts; max 6 active across all industries per base.
- Reset after each expert spawn.
- Each expert provides fixed bonus multiplier (1st: 3.06%, 5th: 28.40%).
- Bonus applied multiplicatively: efficiency × (100% + expert_bonus).

## Trading & Markets

### Commodity Exchange (CX)
- Located on space stations. 4 major: Benten (CI1), Moria (NC1), Hortus (IC1), Antares (AI1). 2 factionless: Arclight (CI2), Hubur (NC2).
- The trading is done via trade books. Each material has its own trade book.
- Buy/Sell orders placed within Price Band (3-day average).
- Orders match: lowest ask filled first on buys, highest bid first on sells.
- In addition to player orders, there are NPC Market Makers (MMs) orders. These orders have an infinite order amount and serve the item sink/tap purpose.

### Contracts (Trading)
- Players can create custom contracts to interact with other players directly.
- There are several types of contracts: Buy commodity, Sell commodity, Ship commodity, Interest loan, Annuity loan, Stable loan.
- Buy/Sell contracts allow a direct exchange of materials at a specific place.
- Ship contracts allow for the transportation of materials to/from a specific location. The material is shipped as a special SHPT item, which is opaque to the player doing the transportation.
- Loans are simply loans, with configurable interest rate and number of installments.
- Each contract has a set of conditions, depending on the type of contract. A condition can depend on the other condition, e.g. one player needs to provide the materials first, before the other player can pick them up.
- Each condition has a deadline. If a deadline is exceeded, the injured party can either breach the contract or extend the deadline by 24 hours.
- Terminology: "open" contract status means that the contract was sent but not yet accepted by the other party. Once accepted, the status changes to "closed".
- The contract can be terminated by the creator if it is still in the "open" status. Otherwise, th termination requires each party to click the "Request termination" button.
- When material purchased at CX cannot fit the storage, an automatic pickup contract is sent to the buyer.

### Local Markets (LM)
- A local bulletin board on the planet or space station.
- Three ad types: Buy, Sell, Shipping.
- Buyers/sellers can be any company, even if they don't own base/warehouse on the planet.
- Ad fees set by planetary governor (base + time factor).
- Shipping ads require origin/destination specification; one of them must be at the LM location.
- Accepting an ad automatically creates a contract between players.

### Foreign Exchange (FX)
- Trade currencies in 1,000-unit ("Lot") increments.

## Shipping & Logistics

### Ships
- Each company starts with 2 starter ships.
- Custom ships built via blueprints at planetary shipyards.
- Ship components: STL engine, FTL reactor, fuel tanks, cargo bay, hull/shielding/stability upgrades.
- Mandatory components: STL engine, STL fuel tank, cargo bay, hull plates.
- Ships take damage from: STL/FTL flight, atmospheric conditions, gravity stress, radiation.
- Ships below 80% condition become slower; repair via SHP command (can be done at the shipyard or space station).

### Flight
- **STL (Slower Than Light)**: Travel within systems. Uses STL fuel. Lower fuel usage = longer flight, lower cost. STL flight uses simulated orbital mechanics.
- **FTL (Faster Than Light)**: Jump between systems via FTL routes (shown as lines on universe map). Uses FTL fuel. Ships must be far enough from celestial bodies before FTL jump, drop out safely away from targets. Reactor overcharge increases damage for faster jumps. FTL flight is a linear path, compared to STL.
- Flights are split in segments, for example: DEP (departure from planet), JMP (jump), CHRG (charging FTL engine), APP (approach to target).
- Aborting flight: finishes current segment; CHRG aborts still complete the ensuing jump; JMP aborts land in random orbit.
- Fuel deducted per segment at segment start.

### Cargo & Inventory
- Cargo limited by weight (t) and volume (m3).
- Every location (base, ship, warehouse) has separate inventory.
- Drag/drop transfers between inventories.

### Shipments
- A **shipment** is a special item type (not a material) that occupies cargo space in an inventory.
- It is created when one party in a **shipping contract** provides the goods to be transported.
- Shipments have weight and volume like regular materials, but have no ticker or material category.
- Each shipment box corresponds to one contract condition (provision → delivery pair). Weight and volume vary per box.
- `SHPT` is not a game tile/command — it is this item type. Do not confuse with tile command strings like `FLT`.
- The MTRA command does **not** support SHPT items — its MaterialSelector only lists commodities. Shipments can only be transferred via drag-and-drop.

### Warehouses
- Rented on planets and space stations (via WAR command).
- Weekly rental fee set by planetary governor.
- Locked if fees unpaid; contents inaccessible until all back fees paid.

## Licenses

Players can purchase licenses for various additional features and automations. There are three tiers: FREE, BASIC, PRO.

## Key Terms

- **POPR**: Population report
- **CoGC**: Chamber of Global Commerce
- **POPI**: Population Infrastructure

---

**Note**: No Refined PrUn features included. All mechanics described are base-game only.
