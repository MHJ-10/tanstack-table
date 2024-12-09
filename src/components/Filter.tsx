import { Column } from "@tanstack/react-table";
import Input from "./Input";

const Filter = ({ column }: { column: Column<any, unknown> }) => {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};


  return filterVariant === "range" ? (
    <div className="flex">
      <Input
        className="w-20"
        type="number"
        placeholder="min"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
      />
      <Input
        className="w-20"
        type="number"
        placeholder="max"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
      />
    </div>
  ) : (
    <Input
      className="w-full border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue as string) ?? ""}
    />
  );
};

export default Filter;
