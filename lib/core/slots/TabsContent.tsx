import type { JSX } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/Tabs";

export type BookingType = "service" | "event";

interface EventsTabs {
    tab: BookingType;
    contentComponent: JSX.Element;
}

const TabsContentCore = () => {
    const EVENT_TABS: EventsTabs[] = [
        {
            tab: "service",
            contentComponent: <h1>contentComponent</h1>,
        },
        // {
        //     tab: 'event',
        //     contentComponent: <CreateEvent />
        // }
    ];

    return (
        <Tabs defaultValue={EVENT_TABS[0].tab} className="cursor-default">
            <TabsList className="h-auto rounded-none border-b border-border bg-transparent p-0">
                {EVENT_TABS.map(({ tab }) => (
                    <TabsTrigger
                        key={tab}
                        value={tab}
                        className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                    >
                        {"Service"}
                    </TabsTrigger>
                ))}
                <div className="">
                    {/* // labels dropdown with value and color */}
                    {/* <button>?</button> */}
                </div>
            </TabsList>

            {EVENT_TABS.map(({ tab, contentComponent }) => (
                <TabsContent key={tab} value={tab}>
                    {contentComponent}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default TabsContentCore;
