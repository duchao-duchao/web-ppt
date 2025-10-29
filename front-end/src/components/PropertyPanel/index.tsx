import { usePresentationStore } from '@/stores/presentationStore';

const PropertyPanel = () => {
  const { selectedElementIds, slides, currentSlideIndex, updateElement } = usePresentationStore();

  if (selectedElementIds.length !== 1) {
    return <div>请选择一个元素</div>;
  }

  const selectedElementId = selectedElementIds[0];
  const currentSlide = slides[currentSlideIndex];
  const selectedElement = currentSlide.elements.find(e => e.id === selectedElementId);

  if (!selectedElement) {
    return <div>未找到元素</div>;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateElement(selectedElementId, { [name]: value });
  };

  const handleNumberInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateElement(selectedElementId, { [name]: Number(value) });
  };

  return (
    <div>
      <h3>属性面板</h3>
      <div>
        <label>Width:</label>
        <input type="number" name="width" value={selectedElement.width} onChange={handleNumberInputChange} />
      </div>
      <div>
        <label>Height:</label>
        <input type="number" name="height" value={selectedElement.height} onChange={handleNumberInputChange} />
      </div>
      <div>
        <label>Left:</label>
        <input type="number" name="left" value={selectedElement.left} onChange={handleNumberInputChange} />
      </div>
      <div>
        <label>Top:</label>
        <input type="number" name="top" value={selectedElement.top} onChange={handleNumberInputChange} />
      </div>
      {selectedElement.type === 'text' && (
        <div>
          <label>Content:</label>
          <input type="text" name="content" value={selectedElement.content} onChange={handleInputChange} />
        </div>
      )}
      {selectedElement.type === 'rect' && (
        <div>
          <label>Background Color:</label>
          <input type="text" name="backgroundColor" value={selectedElement.backgroundColor} onChange={handleInputChange} />
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;