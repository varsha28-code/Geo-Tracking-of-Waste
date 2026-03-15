import sys
import json
import os

def check_waste(image_path):
    # In a real implementation, we would use TensorFlow and YOLOv3 here:
    # 1. Load YOLO model weights and config
    # 2. Preprocess the image
    # 3. Run inference
    # 4. Check if any detected class implies 'waste/garbage'
    
    # For demonstration, we simply check if the file exists and mock a detection
    if not os.path.exists(image_path):
        return {"error": "File not found", "garbage_detected": False}
        
    import random
    mock_classes = ["Plastic Bottle", "Cardboard Box", "Organic Waste", "Metal Can", "Glass Shards"]
    detected_class = random.choice(mock_classes)

    # We mock that garbage is detected with high probability
    result = {
        "garbage_detected": True,
        "confidence": round(random.uniform(0.85, 0.98), 2),
        "bounding_boxes": [
            {"class": detected_class, "x": random.randint(50, 200), "y": random.randint(50, 200), "w": random.randint(100, 300), "h": random.randint(100, 300)}
        ]
    }
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided", "garbage_detected": False}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    result = check_waste(image_path)
    print(json.dumps(result))
