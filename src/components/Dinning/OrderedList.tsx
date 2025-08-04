import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';

type Priority = 'High' | 'Medium' | 'Low';

interface OrderTask {
  id: number;
  name: string;
  time: string;
  priority: Priority;
}

type ColumnType = 'ordered' | 'pending' | 'completed' | 'delivered';

const priorityColor: Record<Priority, string> = {
  High: 'text-red-600 bg-red-100',
  Medium: 'text-yellow-600 bg-yellow-100',
  Low: 'text-green-600 bg-green-100',
};

const initialOrders: Record<ColumnType, OrderTask[]> = {
  ordered: [
    { id: 1, name: 'Burger Meal', time: 'Today 12:00', priority: 'High' },
    { id: 2, name: 'Veg Pizza', time: 'Today 12:30', priority: 'Medium' },
  ],
  pending: [{ id: 3, name: 'Chicken Biryani', time: 'Today 13:00', priority: 'Low' }],
  completed: [{ id: 4, name: 'Grilled Sandwich', time: 'Today 11:00', priority: 'Low' }],
  delivered: [{ id: 5, name: 'Pasta Alfredo', time: 'Yesterday 17:00', priority: 'Low' }],
};

const columns: { key: ColumnType; label: string; color: string }[] = [
  { key: 'ordered', label: 'Ordered Food', color: 'purple' },
  { key: 'pending', label: 'Pending Orders', color: 'blue' },
  { key: 'completed', label: 'Completed Orders', color: 'green' },
  { key: 'delivered', label: 'Delivered Orders', color: 'red' },
];

const OrderedList: React.FC = () => {
  const [orderData, setOrderData] = useState(initialOrders);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !over.id) return;

    const sourceColumn = active.data.current?.column as ColumnType;
    const destinationColumn = over.id as ColumnType;

    if (sourceColumn === destinationColumn) return;

    const taskId = active.id as number;
    const task = orderData[sourceColumn].find((item) => item.id === taskId);
    if (!task) return;

    setOrderData((prev) => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter((item) => item.id !== taskId),
      [destinationColumn]: [...prev[destinationColumn], task],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-center text-2xl font-bold mb-6">Order Management</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => (
            <OrderColumn
              key={col.key}
              columnId={col.key}
              title={col.label}
              color={col.color}
              tasks={orderData[col.key]}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

interface OrderColumnProps {
  title: string;
  color: string;
  tasks: OrderTask[];
  columnId: ColumnType;
}

const OrderColumn: React.FC<OrderColumnProps> = ({ title, color, tasks, columnId }) => {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl shadow-md p-4 border-t-4 border-${color}-500`}
    >
      <h3 className={`text-${color}-700 font-semibold mb-4`}>{title}</h3>
      <div className="space-y-4 min-h-[100px]">
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} column={columnId} />
        ))}
      </div>
    </div>
  );
};

interface DraggableCardProps {
  task: OrderTask;
  column: ColumnType;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ task, column }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { column },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab"
    >
      <h4 className="font-medium text-gray-800">{task.name}</h4>
      <p className="text-xs text-gray-500">{task.time}</p>
      <span
        className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${priorityColor[task.priority]}`}
      >
        {task.priority}
      </span>
    </div>
  );
};

export default OrderedList;
