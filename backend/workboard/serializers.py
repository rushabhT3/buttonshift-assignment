from rest_framework import serializers
from .models import WorkBoard, Task

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.StringRelatedField()

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'assigned_to']

class WorkBoardSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = WorkBoard
        fields = ['id', 'name', 'description', 'tasks', 'created_at', 'updated_at']