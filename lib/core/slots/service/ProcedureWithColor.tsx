// import { type ChangeEvent, useMemo } from "react";
// import type { Procedure } from "../../../@types";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/Label";
// import { Separator } from "../../../components/ui/separator";
// import { StatusDot } from "../../select-with-icon/SelectWithIcon";

// interface ProcedureWithColorProps {
//     procedures: Procedure[];
//     onChange: (event: ChangeEvent<HTMLInputElement>) => void;
// }

// const ProcedureWithColor = ({
//     procedures,
//     onChange,
// }: ProcedureWithColorProps) => {
//     const result = useMemo(() => {
//         return (
//             <>
//                 {procedures.map((procedure) => (
//                     <div key={procedure.id}>
//                         <Separator className="my-2" />

//                         <div className="flex flex-row gap-4 justify-start items-center">
//                             <StatusDot
//                                 className={procedure ? " animate-pulse" : ""}
//                                 width={20}
//                                 height={20}
//                                 color={procedure?.color || "black"}
//                             />
//                             <div>{procedure.name}</div>
//                         </div>

//                         <div>
//                             <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="total" className="text-right">
//                                     Amount:
//                                 </Label>

//                                 <Input
//                                     id={procedure.id}
//                                     min={0}
//                                     name="procedures"
//                                     type="number"
//                                     value={procedure.amount}
//                                     className=""
//                                     onChange={onChange}
//                                 />
//                             </div>
//                             <div>Duration: {procedure.requiredTimeMin}</div>
//                         </div>
//                     </div>
//                 ))}
//             </>
//         );
//     }, [procedures, onChange]);

//     return result;
// };

// export default ProcedureWithColor;
